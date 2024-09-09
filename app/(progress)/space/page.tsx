'use server'
import { StagePrismaType } from "@/app/api/graphql/stage/stage.types";
import Board from "@/components/space/Board";
import prisma from "@/lib/prisma-db";
import { APP_ENV } from '@/store/constants/constants';
import { readdir } from 'node:fs/promises';
import path from 'path';

const getStages = async (): Promise<StagePrismaType[] | undefined | any> => {
  'use server'
  if (process.env.APP_ENV === APP_ENV.BOX) {
    const stagesDirName = path.join(process.cwd(), '/store/shares/stages')
    try {
      const files = await readdir(stagesDirName);
      console.log({ files })
      //    return files
    } catch (err) {
      console.error(err);
      return []
    }

  } else {
    const stages = await prisma.stage.findMany({})
    return stages
  }
}
export default async function SpacePage() {

  const stages = await getStages()
  console.log({ stagesInSpacePage: stages });


  return (<section id="space-page" className="flex flex-col justify-start items-center  w-full h-screen" >

    <Board />


  </section>
  )
}

