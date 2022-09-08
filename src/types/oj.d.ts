namespace OJ {
  export type RuleType = 'OI' | 'ACM';
  export type ProblemLanguage =
    | 'C++'
    | 'Golang'
    | 'Java'
    | 'Python2'
    | 'Python3';
  export type ProblemDifficulty = 'Low' | 'Medium' | 'High';

  export enum SubmissionStatus {
    AC = 0,
    TLE1 = 1,
    TLE2 = 2,
    MLE = 3,
    RE = 4,
    SE = 5,
    JUDGING1 = 6,
    JUDGING2 = 7,
    PAC = 8,
    WA = -1,
    CE = -2,
  }

  export interface ISample {
    input: string;
    output: string;
  }

  export interface IIOMode {
    input: string;
    output: string;
    io_mode: string;
  }

  export interface IProblem {
    id: number;
    tags: string[];
    created_by: {
      id: number;
      username: string;
      real_name: string | null;
    };
    template: unknown;
    _id: number;
    title: string;
    description: string;
    input_description: string;
    output_description: string;
    samples: ISample[];
    hint: string;
    languages: ProblemLanguage[];
    create_time: string;
    last_update_time: string | null;
    time_limit: number;
    memory_limit: number;
    io_mode: IIOMode;
    spj: boolean;
    spj_language: string | null;
    rule_type: RuleType;
    difficulty: ProblemDifficulty;
    source: string;
    total_score: number;
    submission_number: number;
    accepted_number: number;
    static_info: Record<SubmissionStatus, number>;
    share_submission: boolean;
    contest: string | null;
    my_status?: SubmissionStatus | null;
  }

  export interface ISubmissionCase {
    error: number;
    score: number;
    memory: number;
    output: string | null;
    result: SubmissionStatus;
    signal: number;
    cpu_time: number;
    exit_code: number;
    real_time: number;
    test_case: string;
    output_md5: string;
  }

  export interface ISubmissionRunInfo {
    err_info?: string;
    score: number;
    time_cost: number;
    memory_cost: number;
  }

  export interface IOIProblemStatus {
    _id: string;
    score: number;
    status: SubmissionStatus;
  }

  export interface ISubmission {
    id: string;
    create_time: string;
    user_id: number;
    username: string;
    code: string;
    result: SubmissionStatus;
    info: {
      error: string | null;
      data: ISubmissionCase[] | null;
    };
    language: ProblemLanguage;
    shared: boolean;
    statistic_info: ISubmissionRunInfo;
    ip: string;
    contest: string | null;
    problem: number;
    can_unshare: boolean;
  }

  export interface ISubmissionsItem {
    id: string;
    create_time: string;
    user_id: number;
    username: string;
    result: SubmissionStatus;
    language: ProblemLanguage;
    shared: boolean;
    statistic_info: ISubmissionRunInfo;
    problem: string;
    show_link: boolean;
  }

  export interface IUser {
    id: number;
    username: string;
    email: string;
    admin_type: 'Admin';
    problem_permission: 'All';
    create_time: string;
    last_login: string;
    two_factor_auth: boolean;
    open_api: boolean;
    is_disabled: boolean;
  }

  export interface IUserProfile {
    id: number;
    user: IUser;
    real_name: string;
    acm_problems_status: unknown;
    oi_problems_status: {
      problems: Record<string, IOIProblemStatus>;
      contest_problems: Record<string, IOIProblemStatus>;
    };
    avatar: string;
    blog: string | null;
    mood: string | null;
    github: string | null;
    school: string | null;
    major: string | null;
    language: string;
    accepted_number: number;
    total_score: number;
    submission_number: number;
  }
}

export default OJ;
