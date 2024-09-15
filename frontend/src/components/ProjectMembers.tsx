import { useEffect, useState, useCallback, useMemo } from 'react';
import debounce from 'lodash/debounce';
import createApiClient from '../utils/api';
const api = createApiClient();

interface Member {
  id: number;
  name: string;
  login_id: string;
}

interface ProjectMembersProps {
  projectId: string;
}

export default function ProjectMembers({ projectId }: Readonly<ProjectMembersProps>) {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const fetchProjectMembers = useCallback(async () => { // useCallback으로 변경
    try {
      const response = await api.get(`/projects/${projectId}/members`);
      setMembers(response.data);
    } catch (error) {
      console.error('프로젝트 멤버를 불러오는 데 실패했습니다:', error);
    }
  }, [projectId]); // projectId 의존성 추가

  useEffect(() => {
    fetchProjectMembers();
  }, [fetchProjectMembers, projectId]); // fetchProjectMembers 의존성 제거


  const debouncedSearch = useMemo(() => 
    debounce(async (query: string) => {
      if (query.length > 1) {
        try {
          const response = await api.get(`/projects/${projectId}/users/search?query=${query}`);
          setSearchResults(response.data);
        } catch (error) {
          console.error('사용자 검색에 실패했습니다:', error);
        }
      } else {
        setSearchResults([]);
      }
    }, 300),
  [projectId, setSearchResults]); // useMemo로 변경

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  const handleAddMember = async () => {
    if (selectedMember) {
      try {
        await api.post(`/projects/${projectId}/members`, { userId: selectedMember.id });
        fetchProjectMembers();
        setSearchTerm('');
        setSelectedMember(null);
      } catch (error) {
        console.error('멤버 추가에 실패했습니다:', error);
      }
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      await api.delete(`/projects/${projectId}/members/${userId}`);
      fetchProjectMembers();
    } catch (error) {
      console.error('멤버 제거에 실패했습니다:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">프로젝트 멤버</h3>
      <div className="flex flex-col mb-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedMember(null);
            }}
            placeholder="새 멤버 검색 (이름 또는 로그인 ID)"
            className="w-full px-2 py-1 border rounded"
          />
          <button
            onClick={handleAddMember}
            disabled={!selectedMember}
            className={`mt-2 px-4 py-1 rounded ${
              selectedMember
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            추가
          </button>
          {searchResults.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded mt-1 max-h-40 overflow-y-auto">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  className="w-full text-left px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSelectedMember(result);
                    setSearchTerm(`${result.name} (${result.login_id})`);
                  }}
                >
                  {result.name} ({result.login_id})
                </button>
              ))}
            </ul>
          )}
        </div>
      </div>
      <ul className="space-y-2 mb-4">
        {members.map((member) => (
          <li key={member.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
            <span>{member.name} ({member.login_id})</span>
            <button
              onClick={() => handleRemoveMember(member.id)}
              className="text-red-600 hover:text-red-800"
            >
              탈퇴
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}