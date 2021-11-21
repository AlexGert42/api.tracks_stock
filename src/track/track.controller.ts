import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UploadedFile,
    UploadedFiles,
    UseInterceptors
} from "@nestjs/common";
import {TrackService} from "./track.service";
import {CreateTrackDto} from "./dto/create-track.dto";
import {ObjectId} from "mongoose";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";


@Controller('/tracks')
export class TrackController {

    constructor(private trackService: TrackService) {}

    @Get()
    getAll(@Query('count') count: number, @Query('offset') offset: number) {
       return this.trackService.getAll(count, offset)
    }

    @Get('/search')
    search(@Query('query') query: string) {
        return this.trackService.search(query)
    }

    @Get(':id')
    getOne(@Param("id") id: ObjectId) {
        return this.trackService.getOne(id)
    }

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'picture', maxCount: 1 },
        { name: 'audio', maxCount: 1 },
    ]))
    create(@UploadedFiles() { picture, audio }, @Body() dto: CreateTrackDto) {
        return this.trackService.create(dto, picture[0], audio[0])
    }

    @Delete(':id')
    remove(@Param('id') id: ObjectId) {
        return this.trackService.remove(id)
    }

    @Post('/comment')
    addComment(@Body() dto: CreateCommentDto) {
        return this.trackService.addCommentTrack(dto)
    }

    @Post('/listen/:id')
    listen(@Param('id') id: ObjectId) {
        return this.trackService.listen(id)
    }


}