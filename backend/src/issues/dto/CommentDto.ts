export class CommentDto {
    id: number;
    contents: string;
    created_date: string;
    author_id: number;
    author_login_id: string;
    author_name: string;
    issue_id: number;
    project_id: number;
    parent_comment_id: number | null;
    children?: CommentDto[];  // 추가된 부분
  
    constructor(row: any) {
      this.id = row.id;
      this.contents = row.contents;
      this.created_date = row.created_date;
      this.author_id = row.author_id;
      this.author_login_id = row.author_login_id;
      this.author_name = row.author_name;
      this.issue_id = row.issue_id;
      this.project_id = row.project_id;
      this.parent_comment_id = row.parent_comment_id;
      this.children = [];  // 초기화
    }
}