import { Controller, HttpException, Post, Get, Body, Param, HttpStatus, Query } from '@nestjs/common';
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
}