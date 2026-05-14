import { expect, test } from "bun:test"
import type { AnyCircuitElement } from "circuit-json"
import { getDebugSvg } from "../../../infinite-grid-ijump-astar/tests/fixtures/get-debug-svg"
import { MultilayerIjump } from "../../MultilayerIjump"

const inputCircuitJson: AnyCircuitElement[] = [
  {
    type: "pcb_plated_hole",
    pcb_plated_hole_id: "pcb_plated_hole_2",
    pcb_component_id: "pcb_component_0",
    outer_width: 1.1999975999999999,
    outer_height: 1.9999959999999999,
    hole_width: 0.7999983999999999,
    hole_height: 1.5999968,
    shape: "pill",
    port_hints: ["unnamed_platedhole3", "alt_0"],
    x: -4.32511199999999,
    y: -18.594262350000122,
    layers: ["top", "bottom"],
    subcircuit_id: "subcircuit_source_group_1",
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_1",
    pcb_component_id: "pcb_component_0",
    pcb_port_id: "pcb_port_5",
    layer: "top",
    shape: "rect",
    width: 0.29999939999999997,
    height: 1.2999973999999999,
    port_hints: ["A5"],
    x: -1.2499339999999393,
    y: -17.55091295000011,
    subcircuit_id: "subcircuit_source_group_1",
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_7",
    pcb_component_id: "pcb_component_0",
    pcb_port_id: "pcb_port_11",
    layer: "top",
    shape: "rect",
    width: 0.29999939999999997,
    height: 1.2999973999999999,
    port_hints: ["B5"],
    x: 1.7500600000000759,
    y: -17.55091295000011,
    subcircuit_id: "subcircuit_source_group_1",
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_108",
    pcb_component_id: "pcb_component_9",
    pcb_port_id: "pcb_port_108",
    layer: "top",
    shape: "rect",
    width: 0.54,
    height: 0.64,
    port_hints: ["1", "left"],
    x: -5.51,
    y: -15,
    subcircuit_id: "subcircuit_source_group_1",
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_109",
    pcb_component_id: "pcb_component_9",
    pcb_port_id: "pcb_port_109",
    layer: "top",
    shape: "rect",
    width: 0.54,
    height: 0.64,
    port_hints: ["2", "right"],
    x: -4.49,
    y: -15,
    subcircuit_id: "subcircuit_source_group_1",
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_110",
    pcb_component_id: "pcb_component_10",
    pcb_port_id: "pcb_port_110",
    layer: "top",
    shape: "rect",
    width: 0.54,
    height: 0.64,
    port_hints: ["1", "left"],
    x: -5.51,
    y: -12,
    subcircuit_id: "subcircuit_source_group_1",
  },
  {
    type: "pcb_smtpad",
    pcb_smtpad_id: "pcb_smtpad_111",
    pcb_component_id: "pcb_component_10",
    pcb_port_id: "pcb_port_111",
    layer: "top",
    shape: "rect",
    width: 0.54,
    height: 0.64,
    port_hints: ["2", "right"],
    x: -4.49,
    y: -12,
    subcircuit_id: "subcircuit_source_group_1",
  },
]

const input = {
  layerCount: 2,
  minTraceWidth: 0.1,
  bounds: {
    minX: -7,
    maxX: 3,
    minY: -22,
    maxY: -11,
  },
  obstacles: [
    {
      type: "oval",
      layers: ["top", "inner1", "inner2", "bottom"],
      center: {
        x: -4.32511199999999,
        y: -18.594262350000122,
      },
      width: 1.1999975999999999,
      height: 1.9999959999999999,
      connectedTo: ["pcb_plated_hole_2"],
    },
    {
      type: "rect",
      layers: ["top"],
      center: {
        x: -4.49,
        y: -15,
      },
      width: 0.54,
      height: 0.64,
      connectedTo: ["pcb_smtpad_109", "connectivity_net47", "source_trace_19"],
    },
    {
      type: "rect",
      layers: ["top"],
      center: {
        x: -5.51,
        y: -12,
      },
      width: 0.54,
      height: 0.64,
      connectedTo: ["pcb_smtpad_110", "connectivity_net44", "source_trace_20"],
    },
    {
      type: "rect",
      layers: ["top"],
      center: {
        x: -4.49,
        y: -12,
      },
      width: 0.54,
      height: 0.64,
      connectedTo: ["pcb_smtpad_111", "connectivity_net47", "source_trace_21"],
    },
  ],
  connections: [
    {
      name: "source_trace_18",
      pointsToConnect: [
        {
          x: -5.51,
          y: -15,
          layer: "top",
          pcb_port_id: "pcb_port_108",
        },
        {
          x: -1.2499339999999393,
          y: -17.55091295000011,
          layer: "top",
          pcb_port_id: "pcb_port_5",
        },
      ],
    },
    {
      name: "source_trace_20",
      pointsToConnect: [
        {
          x: -5.51,
          y: -12,
          layer: "top",
          pcb_port_id: "pcb_port_110",
        },
        {
          x: 1.7500600000000759,
          y: -17.55091295000011,
          layer: "top",
          pcb_port_id: "pcb_port_11",
        },
      ],
    },
  ],
} as const

test("repro3 wifi board: wild trace jump", () => {
  const autorouter = new MultilayerIjump({
    input: input as any,
    isRemovePathLoopsEnabled: true,
    MAX_ITERATIONS: 1000,
    debug: true,
  })

  const solution = autorouter.solveAndMapToTraces()
  const wildRoute = solution[1]!.route
  const maxSegmentLength = wildRoute.slice(1).reduce((max, point, index) => {
    const previousPoint = wildRoute[index]!
    const segmentLength =
      Math.abs(point.x - previousPoint.x) + Math.abs(point.y - previousPoint.y)
    return Math.max(max, segmentLength)
  }, 0)

  expect(solution).toHaveLength(2)
  expect(wildRoute).toHaveLength(8)
  expect(Math.min(...wildRoute.map((point) => point.y))).toBeLessThan(-20)
  expect(maxSegmentLength).toBeGreaterThan(7)
  expect(
    getDebugSvg({
      inputCircuitJson,
      autorouter,
      solution,
      rowHeight: 13,
      colWidth: 13,
      colCount: 4,
    }),
  ).toMatchSvgSnapshot(import.meta.path)
})
