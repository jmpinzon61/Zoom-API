import { async } from "rxjs";
import axiosInstance from "./axiosInstance";

export const createMeeting = async (meetingData: any) => {
    const response = await axiosInstance.post(`/zoom`, meetingData);
    return response.data;
}

export const getMeetingDetails = async () => {
    const response = await axiosInstance.get(`/zoom`);
    return response.data;
}

export const getMeetingParticipants = async (meetingId: string) => {
    const response = await  axiosInstance.get(`/zoom/participants/${meetingId}`);
    return response.data;
}

export const getCurrentParticipants = async (meetingId: string) => {
    const response = await axiosInstance.get(`/zoom/${meetingId}/participants`);
    return response.data;
}