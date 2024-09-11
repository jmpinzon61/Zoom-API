import { Controller, HttpException, Post, Get, Body, Param, HttpStatus } from '@nestjs/common';
import { MeetingDetails, Participant, ZoomService } from './zoom.service';


@Controller('/zoom')
export class ZoomController {

    constructor(private readonly zoomService: ZoomService) { }

    @Post()
    async createMeeting(@Body() meetingData: any) {
        try {
            return this.zoomService.createMeetingWithAccesToken(meetingData);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Get()
    async getMeetingDetails(): Promise<MeetingDetails> {
        try {
            return await this.zoomService.getMeetingDetailsWithAccesToken();
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }


    @Get('participants')
    async getMeetingParticipants(): Promise<Participant[]> {
        try {
            const accesToken = await this.zoomService.getAccessToken();
            const meetingId = this.zoomService.meetingId;
            if (!meetingId) {
                throw new HttpException('No hay ID de reunión disponible', HttpStatus.BAD_REQUEST);
            }
            return await this.zoomService.getMeetingParticipants(meetingId, accesToken);
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }
}