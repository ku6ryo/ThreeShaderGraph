import style from "./style.module.scss"
import { Button, Icon } from "@blueprintjs/core/lib/esm";
import { Tooltip2 } from "@blueprintjs/popover2"
import { MouseEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { NodeCategory, NodeDefinition } from "../../../definitions/types";

type Props = {
  definitions: NodeDefinition[]
  onSelected: (nodeTypeId: string) => void
}

/**
 * Selector for node types grouped by category. 
 */
export function NodeSelector({
  definitions,
  onSelected,
}: Props) {
  const [categories, nodeMap] = useMemo(() => {
    const catMap = new Map<string, NodeCategory>();
    const nodeMap = new Map<string, NodeDefinition[]>();
    definitions.forEach(def => {
      catMap.set(def.category.id, def.category)
      if (!nodeMap.has(def.category.id)) {
        nodeMap.set(def.category.id, [])
      }
      nodeMap.get(def.category.id)!.push(def)
    })
    return [Array.from(catMap.values()), nodeMap]
  }, []);
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  const onCategoryClick: MouseEventHandler<HTMLButtonElement> & ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void) = useCallback((e) => {
    e.stopPropagation()
    const id = e.currentTarget.dataset.id!;
    if (selectedCatId === id) {
      setSelectedCatId(null)
    } else {
      setSelectedCatId(e.currentTarget.dataset.id!)
    }
  }, [setSelectedCatId, selectedCatId])

  const onNodeClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    e.stopPropagation()
    onSelected(e.currentTarget.dataset.id!)
    setSelectedCatId(null)
  }, [onSelected, selectedCatId])

  useEffect(() => {
    const listener = () => {
      if (selectedCatId) {
        setSelectedCatId(null)
      }
    }
    window.addEventListener("click", listener)
    return () => {
      window.removeEventListener("click", listener)
    }
  }, [selectedCatId])

  return (
    <div className={style.frame}>
      {categories.map((c) => {
        return (
          <div key={c.id} className={style.item}>
            <Tooltip2
              content={c.label}
              placement={"left"}
              usePortal={false}
            >
              <Button onClick={onCategoryClick} data-id={c.id}>
                <Icon icon={c.icon as any} />
              </Button>
            </Tooltip2>
            {selectedCatId === c.id && (
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