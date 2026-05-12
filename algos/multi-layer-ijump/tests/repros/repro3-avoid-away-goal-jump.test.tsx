import { expect, test } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import type { SimpleRouteJson } from "solver-utils"
import { getDebugSvg } from "../../../infinite-grid-ijump-astar/tests/fixtures/get-debug-svg"
import { MultilayerIjump } from "../../MultilayerIjump"

const obstacle = {
  type: "rect" as const,
  center: { x: 2, y: 0 },
  width: 1,
  height: 1,
  layers: ["top"],
  connectedTo: [],
}

const input: SimpleRouteJson = {
  layerCount: 2,
  minTraceWidth: 0.1,
  bounds: { minX: -1, maxX: 7, minY: -3, maxY: 3 },
  obstacles: [obstacle],
  connections: [
    {
      name: "trace_away_goal_jump",
      pointsToConnect: [
        { x: 0, y: 0, layer: "top" },
        { x: 6, y: 2, layer: "top" },
      ],
    },
  ],
}

const inputCircuitJson: AnyCircuitElement[] = [
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "start_pad",
    pcb_component_id: "start",
    layer: "top",
    shape: "rect",
    x: 0,
    y: 0,
    width: 0.25,
    height: 0.25,
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "goal_pad",
    pcb_component_id: "goal",
    layer: "top",
    shape: "rect",
    x: 6,
    y: 2,
    width: 0.25,
    height: 0.25,
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "blocking_pad",
    pcb_component_id: "blocking",
    layer: "top",
    shape: "rect",
    x: obstacle.center.x,
    y: obstacle.center.y,
    width: obstacle.width,
    height: obstacle.height,
  },
]

test("repro3 does not add away-from-goal jumps after hitting an obstacle", () => {
  const autorouter = new MultilayerIjump({ input, debug: true })
  const connection = input.connections[0]
  const startNode = {
    x: 0,
    y: 0,
    l: 0,
    g: 0,
    h: 0,
    f: 0,
    nodesInPath: 0,
    manDistFromParent: 0,
    parent: null,
  }

  autorouter.startNode = startNode
  autorouter.goalPoint = { x: 6, y: 2, l: 0 }
  autorouter.obstacles = autorouter.createObstacleList({
    connection,
    obstaclesFromTraces: [],
  })

  const neighbors = autorouter.getNeighbors({
    x: 1.35,
    y: 0,
    l: 0,
    g: 1.35,
    h: 0,
    f: 0,
    nodesInPath: 1,
    manDistFromParent: 1.35,
    parent: startNode,
    obstacleHit: obstacle,
  })

  expect(neighbors).not.toContainEqual(
    expect.objectContaining({ x: 1.35, y: -2 }),
  )

  const solution = autorouter.solveAndMapToTraces()
  expect(
    getDebugSvg({ inputCircuitJson, autorouter, solution }),
  ).toMatchSvgSnapshot(import.meta.path)
})
