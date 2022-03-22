import { NodeFactory } from "../types"
import style from "./style.module.scss"
import { Button, Icon } from "@blueprintjs/core/lib/esm";
import { Tooltip2 } from "@blueprintjs/popover2"
import { MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { NodeCategory } from "../../../definitions/types";

type Props = {
  definitions: NodeFactory[]
  onSelected: (nodeTypeId: string) => void
}


export function NodeSelector({
  definitions,
  onSelected,
}: Props) {
  const [categories, nodeMap] = useMemo(() => {
    const catMap = new Map<string, NodeCategory>();
    const nodeMap = new Map<string, NodeFactory[]>();
    definitions.forEach(def => {
      catMap.set(def.category.id, def.category)
      if (!nodeMap.has(def.category.id)) {
        nodeMap.set(def.category.id, [])
      }
      nodeMap.get(def.category.id)!.push(def)
    })
    return [Array.from(catMap.values()), nodeMap]
  }, []);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const onCategoryClick: MouseEventHandler<HTMLButtonElement> & ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void)= useCallback((e) => {
    setSelectedCategoryId(e.currentTarget.dataset.id!)
  }, [])
  const onNodeClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    onSelected(e.currentTarget.dataset.id!)
    setSelectedCategoryId(null)
  }, [onSelected])
  useEffect(() => {
    const listener = () => {
      if (selectedCategoryId) {
        setSelectedCategoryId(null)
      }
    }
    window.addEventListener("click", listener, true)
    return () => {
      window.removeEventListener("click", listener)
    }
  }, [])

  return (
    <div className={style.frame}>
      {categories.map((c) => {
        return (
          <div key={c.id} className={style.item}>
            <Tooltip2
              content={c.label}
              placement={"right"}
              usePortal={false}
              isOpen={selectedCategoryId === c.id ? false : undefined}
            >
              <Button onClick={onCategoryClick} data-id={c.id}>
                <Icon icon={c.icon as any} />
              </Button>
            </Tooltip2>
            {selectedCategoryId === c.id && (
              <div className={style.nodes}>
                {nodeMap.get(c.id)!.map((n) => {
                  return (
                    <div
                      key={n.id}
                      className={style.node}
                      onClick={onNodeClick}
                      data-id={n.id}
                    >{n.name}</div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}