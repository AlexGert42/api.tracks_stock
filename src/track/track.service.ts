import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Comment, CommentDocument } from "./schemas/comment.schema";
import { Track, TrackDocument } from "./schemas/track.schema";
import { CreateTrackDto } from "./dto/create-track.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { FileService, FileType } from "../file/file.service";


@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService
  ) {
  }

  async getAll(count = 5, offset = 0): Promise<Track[]> {
    console.log("get all tracksss");

    const tracks = await this.trackModel.find().skip(Number(offset)).limit(Number(count));
    return tracks;
  }


  async getOne(id: ObjectId): Promise<Track> {
    console.log("get track1");

    return this.trackModel.findById(id).populate("comments");
  }


  async create(trackData: CreateTrackDto, picture, audio): Promise<Track> {
    console.log(`create track`, audio, picture);

    const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    const picturePath = this.fileService.createFile(FileType.IMAGE, picture);


    const track = await this.trackModel.create({
      ...trackData,
      picture: picturePath,
      audio: audioPath,
      listens: 0
    });
    return track;
  }


  async remove(id: ObjectId): Promise<ObjectId> {
    console.log("remove track");

    const track = await this.trackModel.findByIdAndDelete(id);
    return track._id;
  }

  async addCommentTrack(dto: CreateCommentDto): Promise<Comment> {
    console.log("add comment track");

    const track = await this.trackModel.findById(dto.trackid);
    const comment = await this.commentModel.create({ ...dto });
    track.comments.push(comment._id);
    await track.save();
    return comment;
  }

  async listen(id: ObjectId) {
    console.log("add listen in track");

    const track = await this.trackModel.findById(id);
    track.listens += +1;
    track.save();
  }

  async search(query: string): Promise<Track[]> {
    console.log("search track");

    const tracks = await this.trackModel.find({
      name: {$regex: new RegExp(query, 'i')}
    })
    return tracks;
  }


}