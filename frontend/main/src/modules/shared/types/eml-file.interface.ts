export interface EmlFile {
    id: string;
    fileName: string;
    sendDate: string;
    uploadDate: string;
    to: string[];
    cc: string[];
    from: string[];
    subject: string;

    isDanger: boolean;
    dangerValues: string[];
}
