import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { URLSearchParams } from 'url';


export interface MeetingDetails {
    id: string;
    topic: string;
    start_time: string;
    status: string;
    join_url: string;
    duration: number;
}

@Injectable()
export class ZoomService {

    private readonly zoomApiUrl = 'https://api.zoom.us/v2';
    private readonly zoomOAuthUrl = 'https://zoom.us/oauth/token';
    private readonly clientId = 'SmP9tgHmQpeC0YZ_dIngUQ';
    private readonly clientSecret = 'mZb9Eef3p4KnXthx8su7msgcu9WgCR3I';
    private readonly accountId = 'MCvjXa0xSSqNPBVkcReyrg';
    private readonly baseUrl = 'https://api.zoom.us/v2/report/meetings';
    public meetingDetails: MeetingDetails;
    public meetingId: string;


    constructor(private readonly httpService: HttpService) { }

    async getAccessToken(): Promise<string> {
        const auth = `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`;
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.zoomOAuthUrl}?grant_type=account_credentials&account_id=${this.accountId}`, new URLSearchParams().toString(), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: auth,
                    },
                }),
            );
            return response.data.access_token;
        } catch (error) {
            throw new HttpException('No se pudo obtener el token de acceso', HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    async createMeeting(accesToken: string, meetingData: any): Promise<any> {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.zoomApiUrl}/users/me/meetings`, meetingData, {
                    headers: {
                        Authorization: `Bearer ${accesToken}`,
                        'Content-Type': 'application/json'
                    },
                }),
            );
            this.meetingId = response.data.id;
            return response.data;
        } catch (error) {
            throw new HttpException('No pudo crear una reunión', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async createMeetingWithAccesToken(meetingData: any): Promise<any> {
        const accesToken = await this.getAccessToken();
        const meetingDetails = await this.createMeeting(accesToken, meetingData);
        return meetingDetails;
    }

    async getMeetingDetails(meetingId: string, accesToken: string): Promise<MeetingDetails> {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.zoomApiUrl}/meetings/${meetingId}`, {
                    headers: {
                        Authorization: `Bearer ${accesToken}`,
                    },
                }),
            );

            const { id, topic, start_time, status, join_url, duration } = response.data;
            return { id, topic, start_time, status, join_url, duration };
        } catch (error) {
            throw new HttpException('No se puedo tener detalles de la reunion', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getMeetingDetailsWithAccesToken(): Promise<MeetingDetails> {
        if (!this.meetingId) {
            throw new HttpException('No se ha creado una reunion', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const accesToken = await this.getAccessToken();
        return this.getMeetingDetails(this.meetingId, accesToken);
    }
}
