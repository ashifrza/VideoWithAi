import { authOptions } from "@/lib/auth";
import { connectToDatabase  } from "@/lib/db";  
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function GET(){
    try {
        await connectToDatabase()
        const Videos = await Video.find({}).sort({createAt: -1}).lean()

        if(!Videos || Video.length === 0){
            return NextResponse.json([],{status: 200})
        }

        return NextResponse.json(Video)
    } catch {
        return NextResponse.json({ message: "Failed to fetch videos" }, { status: 500 })
    }
}

export async function POST(request: NextRequest){
    try {
        const session = await getServerSession(authOptions)
        if(!session){
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await connectToDatabase()
        const body: IVideo = await request.json()
        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                {error: "Missingn required fields"},
                {status: 400}
            )
        };

        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transforms: {
             height: 1920,
                fit: 'cover',
                format: 'mp4',
             width: 1080,
             quality: body?.transforms?.quality ?? 100

            },
        };
      const newVideo = await Video.create(videoData)
      return NextResponse.json(newVideo, { status: 201 })

    } catch {
        return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
    }
}