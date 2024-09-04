import { GuestRegisterSchema } from "@/api/graphql/tools";
import { PrismaClient } from '@prisma/client';
import { Firestore } from 'firebase-admin/firestore';
import { LIISMAIIL_STATUS_ENUM } from '../profile/profile.types';
import { AddGuestPrismaInput, GuestPrismaType, STAGE_CATEGORY_ENUM, StageTypeData } from './stage.types';


const stages = async (_: undefined, __: undefined, { dbFirestore }: { dbFirestore: Firestore }): Promise<Array<StageTypeData> | null> => {
  try {
    const stages: Array<StageTypeData> | null = [];
    const querySnapshot = await dbFirestore.collection('stages').orderBy('createdAt', 'desc').get();
    querySnapshot.forEach((doc: any) => {
      stages.push({ id: doc?.id, ...doc?.data() });
    });
    return stages;
  } catch (error) {
    console.log({ error });
    return Promise.reject(error);
  }
};
const hostsForDashboard = async (_: undefined, __: undefined, { prisma }: { prisma: PrismaClient }): Promise<Array<GuestPrismaType> | null> => {
  try {
    const hosts = await prisma.guest.findMany({ where: { status: LIISMAIIL_STATUS_ENUM.HOST } })
    return hosts
  } catch (error) {
    console.log({ error });
    return Promise.reject(error);
  }
};

const stagesById = async (
  _: undefined,
  { id }: { id: number },
  { dbFirestore }: { dbFirestore: Firestore }
): Promise<Array<StageTypeData> | null> => {
  try {
    const stages: Array<StageTypeData> = [];
    return dbFirestore
      .collection('stages')
      .where('id', '==', `${id}`)
      .get()
      .then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          stages.push({ id: doc.id, ...doc.data() });
          /*   console.log({ productDoc: doc.data() }) */
        });

        return stages;
      });
  } catch (error) {
    console.log({ error });
    return Promise.reject(error);
  }
};

const stagesByToken = async (
  _: undefined,
  { token }: { token: number },
  { dbFirestore }: { dbFirestore: Firestore }
): Promise<Array<StageTypeData> | null> => {
  try {
    const stages: Array<StageTypeData> = [];
    return dbFirestore
      .collection('stages')
      .where('authorId', '==', `${token}`)
      .get()
      .then((querySnapshot: any) => {
        querySnapshot.forEach((doc: any) => {
          stages.push({ id: doc.id, ...doc.data() });
        });
        return stages;
      });
  } catch (error) {
    console.log({ error });
    return Promise.reject(error);
  }
};

const stagesByCategory = async (
  _: undefined,
  { category }: { category: STAGE_CATEGORY_ENUM },
  { dbFirestore }: { dbFirestore: Firestore }
): Promise<StageTypeData | null> => {
  try {
    return dbFirestore
      .collection('stage')
      .where('categories', 'array-contains', category)
      .get()
      .then((snapshot: any) => ({
        id: snapshot.id,
        ...snapshot.data()
      }));
  } catch (error: any) {
    throw error;
  }
};

// Mutations

const addStage = async (
  _: undefined,
  { input }: { input: StageTypeData },
  {
    dbFirestore,
    slug,
    timeStamp
  }: { dbFirestore: Firestore; slug: (arg: string) => string; storageRef: any; currentProfile: any; timeStamp: any; req: any }
): Promise<StageTypeData | undefined> => {
  const { authorId, id, title, sprints, grids, published, categories } = input;
  const titleSlug = slug(title);
  const createdAt = timeStamp;
  const stage = {
    title,
    titleSlug,
    authorId, id, sprints, grids, published, categories,
    createdAt,

  };
  try {
    const docRef = dbFirestore.collection('stages').doc();
    await docRef
      .get()
      .then((snapshot: any) => {
        if (snapshot.exists) {
          docRef.set({ ...stage });
        }
      })
      .catch((error: any) => {
        throw new Error(error);
      });
    return { authorId, id, title, sprints, grids, published, categories }
  } catch (error: any) {
    throw error;
  }
};

const addStagePrisma = async (
  _: undefined,
  { input }: { input: StageTypeData },
  {
    dbFirestore,
    slug,
    timeStamp
  }: { dbFirestore: Firestore; slug: (arg: string) => string; storageRef: any; currentProfile: any; timeStamp: any; req: any }
): Promise<StageTypeData | undefined> => {
  const { authorId, id, title, sprints, grids, published, categories } = input;
  const titleSlug = slug(title);
  const createdAt = timeStamp;
  const stage = {
    title,
    titleSlug,
    authorId, id, sprints, grids, published, categories,
    createdAt,

  };
  try {
    const docRef = dbFirestore.collection('stages').doc();
    await docRef
      .get()
      .then((snapshot: any) => {
        if (snapshot.exists) {
          docRef.set({ ...stage });
        }
      })
      .catch((error: any) => {
        throw new Error(error);
      });
    return { authorId, id, title, sprints, grids, published, categories }
  } catch (error: any) {
    throw error;
  }
};


const addGuestPrisma = async (
  _: undefined,
  { input }: { input: AddGuestPrismaInput },
  { registerPrisma, }: { registerPrisma: (arg: any) => any, }
): Promise<GuestPrismaType | undefined> => {
  try {
    console.log({ input });

    const { host, country, password, tokenId, } = input;

    const data = GuestRegisterSchema.parse({
      tokenId,
      host,
      country,
      password,
    })
    console.log({ data });

    try {
      const { message } = await registerPrisma({ ...data, collaboratorId: 'O6cKgXEsuPNAuzCMTGeblWW9sWI3' })
      const { tokenId } = JSON.parse(message)
      console.log({ tokenId });

      return JSON.parse(message) as GuestPrismaType

      //redirect(`/space/${slug(data.host)}`)
    } catch (e) {
      console.error(e)
      return {
        tokenId: -1,
        host: -1,
        flag: '',

        collaboratorId: '',
        status: '',
        country: ''
      }
      //redirect(`/liismaiil/${slug(data.host)}`)

    }
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

const updateGuestPrisma = async (
  _: undefined,
  { input }: { input: AddGuestInput },
  { dbFirestore, timeStamp }: { dbFirestore: Firestore; timeStamp: unknown }
): Promise<GuestPrismaType | undefined> => {
  try {
    const { tokenId, host, collaboratorId, stages, sprints } = input;

    const updatedAt = timeStamp;
    const docRef = dbFirestore.collection('guests').doc(`${tokenId}`);
    docRef
      .get()
      .then((snapshot: any) => {
        if (snapshot.exists) {
          return docRef
            .set({ host, collaboratorId, stages, sprints }, { merge: true })
            .then(() => {
              return { tokenId, host, collaboratorId, stages, sprints }
            })
            .catch((error: any) => {
              throw new Error(error);
            });
        } else {
          throw new Error('can t find profile in database');
        }
      })
      .catch((error: any) => {
        throw new Error(error);
      });
    return {
      tokenId, host, collaboratorId, stages, sprints
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

const promoteStages = async (
  _: undefined,
  { input }: { input: PromoteStageInput },
  { dbFirestore }: { dbFirestore: Firestore }
): Promise<{ success: boolean } | undefined> => {
  const { stage, category } = input;
  try {
    return dbFirestore
      .collection('stages')
      .doc(`${stage}`)
      .update({
        categories: FieldValue.arrayUnion(category)

      })
      .then((doc) => {
        console.log({ doc });
        return { success: true };
      });
  } catch (error: any) {
    throw new Error(error);
  }

};


const ProductResolver = {
  Query: {
    stages,
    hostsForDashboard,
    stagesById,
    stagesByCategory,
    stagesByToken
  },
  Mutation: {
    addStage,
    addGuestPrisma,
  }
};
export default ProductResolver;
