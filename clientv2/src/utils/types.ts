//TODO: create type for user
//TODO: create type for channel
//TODO: create type for video
//TODO: create type for vote
//TODO: create type for category
//TODO: create type for comment

export interface RequestResponse<T = any> {
    type: string | "error" | "success";
    status: boolean;
    data: T;
    message: string;
}

export type EventViewResponseData = {
    id: number;
    title: string;
    photo: string | null;
    cover: string | null;
    createdAt: string;
    updatedAt: string;
    current_stage: number;
    description: string;
    end_date: string;
    start_date: string;
    limit: number;
    registration_start: string;
    registration_end: string;
    stage_count: number;
    status: number;
    category_id: number;
    sponsor_name: string;
    sponsor_url: string;
    subscription_count: number;
    submission_count: number;
    participated: boolean;
    category: {
        name: string;
        id: number;
    }
}

export type EventViewResponse = RequestResponse<EventViewResponseData>
