'use client'
import { AyahTabletType, GridInput, SprintType } from '@/api/graphql/sprint/sprint.types'

import { Draggable } from '@/components/shared/Draggable'
import { Droppable } from '@/components/shared/Droppable'
import { sprintActions } from '@/store/slices/sprintSlice'
import { RootStateType } from '@/store/store'
import {
  closestCenter,
  DndContext,
} from '@dnd-kit/core'
import * as _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { APP_ENV } from '@/store/constants/constants'
import { GridNormalize } from '@/lib/tools/GridNormalize'
import { toast } from 'react-toastify'

type AyahWithIndex = {
  id: number;
  order: number;
  text: string;
  juz: number;
  slice?: string;
  _id?: string;
}
export default function Space() {

  const dispatch = useDispatch()
  const { sprints, gridsSelected, gridSelected } = useSelector((state: RootStateType) => state.sprint)

  const { setSprints, setSprintsTitles, setGridsSelected, setGridSelected, setAyahArraySelected, hideAy, resetHidedAy, setMinMax } = sprintActions


  const [gridState, setGridState] = useState<[] | null>(null)
  const [gridResults, setGridResults] = useState<[{ grid: string, wins: number, faults: number }] | null>(null)
  const [gridSortedState, setGridSortedState] = useState<AyahWithIndex[] | null>(null)
  //AyahTabletType & { id: number }[]
  const [gridDroppable, setGridDroppable] = useState<AyahWithIndex[]>([{ id: -1, order: -1, text: '', juz: -1 }])
  const [orderedAyahs, setOrderedAyahs] = useState<AyahWithIndex[]>([{ id: -1, order: -1, text: '', juz: -1 }])
  /* useEffect(() => {
    console.log({ sprintsSerialized });

    if (typeof sprintsSerialized !== 'undefined' && sprintsSerialized?.length > 0) {
      console.log(sprintsSerialized)
      dispatch(setSprints({ sprints: sprintsSerialized as SprintType[] }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sprintsSerialized])
*/
  useEffect(() => {
    /*  const textCont = JSON.parse(document.getElementById("__NEXT_DATA__").textContent)
     console.log({ textCont });
  */
    (async () => {

      if (process.env.APP_ENV === APP_ENV.BOX) {
        try {
          const allSprints: SprintType[] = [];
          const ftch = await fetch('/api/download-sprints', {
            method: 'GET',
          })
          const sprints = await ftch.json();
          console.log({ sprints, length: sprints.length });

          const titleFromJson = sprints.map(ttle => ttle.split('.').shift())
          dispatch(setSprintsTitles({ sprints: titleFromJson }))

        } catch (err) {
          console.log({ err });

        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {
    if (gridSortedState) {
      // console.log({ shuffeled: _.shuffle(gridSortedState) })
    }
  }, [gridSortedState])
  const sortAyahs = (ayahs: AyahWithIndex[]) => {
    return _.sortBy(ayahs, [function (ay: AyahTabletType) { return ay.order; }]);
  }
  const isCheckedGrid = (grid: GridInput) => {
    if (gridSelected?.grid === grid?.grid && gridSelected.ayahs.length === grid.ayahs.length) {
      return true
    }
    return false
  }

  const displayGridHandler = (grdNb: number) => {
    const newAyhsArr = []
    const aygrd = _.shuffle(gridSelected.ayahs[grdNb])
    _.forEach(aygrd, function (ay, index) {
      const newAy = new GridNormalize(ay, index)
      // console.log({ newAy, order: ay.order })

      // console.log({ newAy })
      newAyhsArr.push(newAy)
      //const jsone = JSON.stringify(newAyhsArr)

    })
    console.log({ newAyhsArr })
    setGridState(newAyhsArr)
    setOrderedAyahs(sortAyahs(newAyhsArr))
    dispatch(resetHidedAy())
  }
  useEffect(() => {
    if (gridState && gridState[0]) {
      setGridSortedState(gridState.map((grd: AyahTabletType, index: number) => new GridNormalize(grd, index)))
    }
  }, [gridState])
  function handleDragOver(event) {
    console.log({ event })
  }
  /*   useEffect(() => {
      console.log({ gridDroppable })
      console.log({ orderedAyahs })
      console.log({ gridSortedState })
    }, [gridDroppable, orderedAyahs, gridSortedState])
   */
  const { min, max } = useMemo(() => {
    const orders = gridState?.map(ay => ay.order)
    const min = _.min(orders)
    const max = _.max(orders)
    console.log({ min, max })
    return { min, max }
  }, [gridState])

  function handleDragEnd(event) {
    const { active, over } = event;
    //const act = active.id.split('-')
    // console.log({ order: act[0], id: act[1] })
    console.log({ active, over, activated: gridSortedState[active.id].order })
    const ayExists = gridDroppable?.filter(ayat => ayat?.id === active.id)
    console.log({
      gridSortedState,
      order: gridSortedState[active.id].order,
      length: gridDroppable?.length,
      //typefAyExists: typeof ayExists[0] === 'undefined'
    })
    if (gridSortedState[active.id].order === orderedAyahs[0].order) {
      const ayahFoundPrems = gridSortedState[active.id]
      const sortedFiltered = gridSortedState?.filter(ayat => ayat?.id !== active.id)
      console.log({ ayahFoundPrems })
      console.log({ ayExists })

      setGridDroppable([gridSortedState[active.id]])
      // setGridSortedState(sortedFiltered)
    } else if (gridDroppable && gridDroppable.length >= 1 && gridDroppable.length < gridSortedState.length) {
      console.log({
        order: gridSortedState[active.id].order,
        length: gridDroppable.length
      })
      if (gridDroppable.length === gridSortedState[active.id].order) {

        console.log({
          order: gridSortedState[active.id].order,
          length: gridDroppable.length
        })
        setGridDroppable(gridDroppable => [...gridDroppable, gridSortedState[active.id]])
        const sortedFiltered = gridSortedState?.filter(ayat => ayat?.id !== active.id)
        // setGridSortedState(sortedFiltered)

      } else {
        toast.warning("you must take another")
      }
    } else {
      toast.warning("you must take another")
    }
  }

  function handleShuffle() {
    const newGrid = _.shuffle(gridState)
    console.log({ newGrid })
    setGridDroppable([{ id: -1, order: -1, text: '', juz: -1 }])
    setGridSortedState(newGrid.map((grd, index) => ({ ...grd, id: index })))
  }
  function handleValidate() {
    const newGrid = _.shuffle(gridState)
    console.log({ newGrid })
    setGridSortedState(newGrid.map((grd, index) => ({ ...grd, id: index })))
  }

  const [page, setPage] = useState(1);

  function paginationHandlerUp() {
    setPage((page) => (page++))
  }

  function paginationHandlerDown() {
    setPage((page) => page--)
  }

  return (<div id="spacePage" className="flex flex-col justify-start items-center gap-3 md:w-full mt-10  h-full " >
    <div className="flex flex-col justify-start items-center  w-full overflow-visible" >
      {sprints && sprints.length > 0 && sprints[0].stages && sprints[0].stages.map((stage, index) => {

        const grdKeys = Object.keys(stage.grids)
        return (<div key={`${stage.title}-${index}`} className="flex flex-col justify-center items-stretch">
          <div className="flex justify-col justify-center items-center my-3 py-3 capitalize text-center">
            <h2>{`[sprint] :   ${sprints[0].title} / [stage] : ${stage.title}`} </h2>
            <span> {`\u{1F984}`} </span>
          </div>
          <div className="flex gap-3 justify-between items-center sm:flex-col sm:justify-start ">
            {stage?.grids && grdKeys?.length > 0 && grdKeys.map((gridId: string, index: number) => {
              const _grd = stage.grids[gridId]
              //console.log({ _grd })
              return (<div key={`${_grd.title}-${index}`} className="flex flex-col justify-start  items-center border-2 shadow-md  border-green-500/30">
                <div key={`${_grd.title}`} className="flex flex-col justify-start  items-center gap-3 ">
                  {`sourat: ${_grd.souraName}, nb:  ${_grd.souraNb} 
                   grid: ${_grd.grid}`}
                  {_grd?.ayahs && _grd?.ayahs &&
                    <div className="flex w-full justify-start px-3 py-2 items-center  flex-col   border-blue-300">
                      <div className="flex w-full justify-start px-3 py-2 items-center    border-blue-300">
                        <input type="radio" name='grids' id='grids' checked={isCheckedGrid(_grd)} onChange={() => {
                          dispatch(setGridSelected({ grid: _grd }))
                        }} />
                        <label className='ml-5' htmlFor='grids'>{`grids- from ${_grd.arabName}`} </label>
                      </div>
                    </div>}
                </div>
              </div>)
            }
            )
            }
            <nav aria-label="Page navigation example">
              <ul className="inline-flex -space-x-px text-sm">
                <li>
                  <button onClick={() => paginationHandlerDown()}
                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight
                   text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100
                    hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700
                     dark:hover:text-white">Previous</button>
                </li>
                <li>
                  <button onClick={() => paginationHandlerUp()} className="flex items-center justify-center px-3 h-8 
               leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 
               hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700
                dark:hover:text-white">Next</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>)
      })}
    </div >
    <div className="flex justify-start items-start h-3/4  w-full border  border-emerald-700 bg-green-400 text-sm text-blue-800" >
      <div className="flex flex-col justify-start items-start h-full  w-1/4 border  border-emerald-700 bg-green-400 text-sm text-blue-800" >

        {typeof gridSelected !== 'undefined' && gridSelected?.ayahs.length > 0 &&
          gridSelected.ayahs?.map((aygrd: AyahTabletType[], index) => {
            const orders = aygrd.map(ay => ay.order)
            const min = _.min(orders)
            const max = _.max(orders)
            //  dispatch(setMinMax({ minmax: { min, max } }))
            return (
              <div key={`${aygrd[0].order}`} className="flex flex-col gap-3 text-center justify-start items-start">
                <button onClick={() => displayGridHandler(index)} >
                  <div className="flex  cursor-pointer  justify-between items-center">
                    <div className="text-center p-3 ">
                      <p>{`${index}:    `} </p>
                    </div>
                    <div className="flex ">
                      <p>{` from ayah ${min} to ${max} `} </p>
                    </div>
                  </div>
                </button>
              </div>)
          })}
      </div>
      <div className="flex  justify-start items-start h-full  w-3/4 border  bg-slate-300 text-sm text-gray-500" >
        <div className="flex flex-col pl-2 py-3 justify-start items-start h-full  w-1/4 border  border-emerald-700 text-base " >
          {gridState && orderedAyahs.map((ay: AyahTabletType, index: number) => {

            return (<div key={`${ay.order}-${index}`} >
              <p>{`${index} : ${ay.order} - ${ay.text} `} </p>
            </div>)
          })}
          {/*   <SortableContext strategy={verticalListSortingStrategy} items={gridSortedState ?? gridSortedState}>
              {gridSortedState.map((ay: AyahTabletType & { id: number }, index: number) => {
                console.log({ gridSortedState })
                return (<div key={`${ay.order}-${index}`} className="flex my-3  justify-start items-center">
                  <SortableItem id={ay.order} >
                    <p >{` ${ay.text} `} </p>
                  </SortableItem>
                </div>)
              })}
            </SortableContext> */}
        </div>
        <DndContext autoScroll={true} onDragOver={handleDragOver} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
          {gridSortedState && gridSortedState.length > 0 &&
            <div className="flex flex-col justify-start items-center h-full  w-1/4 border  border-emerald-700 text-sm " >
              {gridSortedState.map((ay, index) => {
                // console.log({ ay, index })
                return (<div key={`${ay.order}-${index}`} className="flex my-3  justify-start items-center">
                  <Draggable id={index} >
                    <p >{` ${ay.text} `} </p>
                  </Draggable>
                </div>)
              })}
              <div className="flex  justify-evenly items-center w-full border text-sm border-spacing-1 my-3
               text-gray-500">
                <button className=" px-5 py-3 border  rounded-md border-emerald-700" onClick={handleShuffle}> shuffle </button>
                <button className=" px-5 py-3 border  rounded-md border-emerald-700" onClick={handleValidate}> validate </button>
              </div>
            </div>}
          {gridDroppable && gridDroppable.length > 0 &&
            <div className="flex flex-col justify-start items-center relative h-128  w-1/4 border  border-blue-500  text-sm " >
              <div className="flex flex-col justify-start items-center h-full  w-full border  border-emerald-700  text-sm " >
                {gridDroppable.map((ay, index) => {
                  return (<div key={`${ay.order}-${index}`} className="flex my-3  justify-start items-center">
                    <Droppable id={index} >
                      <p >{` ${ay.text} `} </p>
                    </Droppable>
                  </div>)
                })}
                <div className="flex  justify-evenly items-baseline w-full absolute bottom-0 right-0 border  bg-slate-300 text-sm border-t-2 border-teal-200 text-gray-500">
                  <button className=" px-5 py-3 border  rounded-md border-emerald-700" onClick={() => setGridDroppable(null)}> free </button>
                  <button className=" px-5 py-3 border  rounded-md border-emerald-700" onClick={handleShuffle}> shuffle </button>
                  <button className=" px-5 py-3 border  rounded-md border-emerald-700" onClick={handleValidate}> validate </button>
                </div>
              </div>
            </div>
          }
          <div className="flex flex-col justify-start items-center h-full  w-1/4 border  border-emerald-700 text-sm " >
            {gridResults && gridResults.map((red: any, index: number) => {
              console.log({ red })
              return (
                <div key={`${ay.order}-${index}`} className="flex my-3  justify-start items-center">
                  <Draggable id={`${ay.order}-${index}`} key={`${ay.order}-${index}`}>
                    <p tabIndex={ay.order}>{` ${ay.text} `} </p>
                  </Draggable>
                </div>)
            })}
          </div>
        </DndContext>
      </div>
    </div >
  </div >
  )
}


/* export async function getSprints() {

  if (process.env.APP_ENV === APP_ENV.WEB) {
    await connectMongoose()
    try {
      const allSprints: SprintType[] = [];
      const sprints = await SprintModel.find({}).lean().exec();

      sprints.forEach(async (sprt: SprintType) => {
        const sprint_id_Omitted = omitIdDeep(sprt, '_id')
        //console.log({ sprint_id_Omitted })
        const {
          title,
          description,
          author,
          stages } = sprint_id_Omitted
        // console.log({ title, description, author })
        const stagesSerialized = await stages.map((stage: StageType) => {

          const grids_id_omitted = omitIdDeep(stage.grids, '_id') as Array<GridType>
          //console.log({ grids_id_omitted: JSON.stringify(grids_id_omitted, null, 2) })
          return ({
            id: stage.id,
            title: stage?.title ? stage.title : 'liismaiil_test',
            guests: stage.guests,
            grids: grids_id_omitted
          })
        })
        allSprints.push({
          title: title ? title : 'liismaiil_test',
          description,
          author, stages:
            stagesSerialized
        })
        // console.log({ seri: allSprints[0], stagesSerialized })
      })

      console.log({ allSprints });

      return {
        props: {
          sprintsSerialized: allSprints
        },
        /* fallback: 'blocking', 
        revalidate: 600
      }
    } catch (error) {
      return {
        props: {
          sprintsSerialized: null
        },

        revalidate: 600
      }
    }
  } else {
    try {
      const allSprints: SprintType[] = [];
      const ftch = await fetch('/api/download-sprints', {
        method: 'GET',
      })
      const sprints = await ftch.json();
      console.log(sprints);
      console.log({ allSprints });

      return {
        props: {
          sprintsSerialized: sprints
        },
        /* fallback: 'blocking', 
      }
    } catch (error) {
      return {
        props: {
          sprintsSerialized: null
        },

        revalidate: 600
      }
    }
  }
}
 */