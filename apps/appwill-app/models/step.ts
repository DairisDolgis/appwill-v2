export interface Step {
    header: string;
    programs: string[];
    activateWarningText?: boolean;
    warningText?: string;
    mediaType?: string,
    media: File[] | string;
    comments?: string;
}