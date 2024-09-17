import { Controller, HttpException, Post, Get, Body, Param, HttpStatus} from '@nestjs/common';
import { MeetingDetails, ZoomService } from './zoom.service';


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

    @Get('participants/:meetingId')
    async getMeetingParticipants(@Param('meetingId') meetingId: string) {
        try {
            const participants = this.zoomService.getMeetingParticipants(meetingId);
            return participants;
        } catch (error) {
            throw new HttpException('No se puedo obtener la lista de participantes', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/:meetingId/participants')
    async getCurrentParticipants(@Param('meetingId') meetingId: string) {
        try {
            const participants = this.zoomService.getCurrentParticipants(meetingId);
            return participants;
        } catch (error) {
            throw new HttpException('No ahi participantes actualmete en linea', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}