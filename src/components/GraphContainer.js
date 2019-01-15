import React from 'react';
import Graph, { Node } from 'react-json-graph';
//import { Graph } from 'react-d3-graph';

const size = {
    width: 15,
    height: 15
}

let graphHeight = 600;


const transformTraceToGraph = (trace, setNode) => {
    const offset = 95;
    const xOffset = 65;
    let fromOffset = 1;
    let graph = {
        isStatic: false,
        "isDirected": 1,
        "isVertical": 1,
        nodes: [],
        edges: []
    };

    if(!trace){
        return graph;
    }

    if(trace.event_tx.from.length > 0){
        trace.event_tx.from.forEach((from, index) => {
            graph.nodes.push({
                id: from.tx_hash,
                label: {
                    ...from.content,
                    setNode
                },
                position: {
                    x: xOffset * index,
                    y: (fromOffset - 1) * offset
                },
                size
            });
            graph.edges.push({
                source: trace.tx_hash,
                target: from.tx_hash
            })
        });
        fromOffset++;
    }

    graph.nodes.push({
        id: trace.tx_hash,
        label: {
            ...trace.content,
            setNode
        },
        position: {
            x: (fromOffset - 1) * xOffset,
            y: (fromOffset - 1) * offset
        },
        size
    });

    if(trace.events){
        trace.events.forEach((event, index) => {
            graph.nodes.push({
                id: event.tx_hash,
                label: {
                    ...event.content,
                    setNode
                },
                position: {
                    x: (fromOffset - 1) * xOffset,
                    y: (index + fromOffset) * offset
                },
                size
            });
            graph.edges.push({
                source: trace.tx_hash,
                target: event.tx_hash
            })
        });
    }

    console.log(graph);

    return graph;
}

const GraphContainer = ({ trace, setFocusedNode }) => {

    const setNode = node => {
        setFocusedNode(node);
    }

    const data = transformTraceToGraph(trace, setNode);

    return (
        <div onClick={(event) => console.log(event.clientX, event.clientY)} style={{width: '%'}} id="graph-container">
            <Graph
                width={window.innerWidth * 0.45}
                height={graphHeight}
                json={data}
                scale={0.6}
                Node={TraceNode}
                shouldContainerFitContent={false}
            />
        </div>
    )
}

class TraceNode extends Node {
    renderContainer({content, isDragging}) {
        return (
            <div
                onClick={() => content.setNode(content)}
                style={{
                    position: 'relative',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    background: '#fff',
                    border: '2px solid #50cbe3',
                    borderRadius: '50%',
                    textAlign: 'center',
                    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)'
                }}
            >
                <div className='Node__label'
                    style={{
                        position: 'absolute',
                        top: '0px',
                        left: '25px',
                        fontSize: '14px',
                        fontWeight: '700',
                        transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)'
                    }}
                >{`${content.type} ${content.type === 'NEW_TRACE'? `- ${JSON.parse(content.fragments[0]).data.name}`: ''}`}</div>
            </div>
        );
    }
}

export default GraphContainer;

/*
<Graph
    id="trace-graph"
    data={data}
    onClickNode={setNode}
    //onMouseOverNode={event => console.log(event)}
    config={{
        d3: {
            "linkLength": 120,
            "gravity": -120
        },
        width: 800,
        height:500,
        nodeHighlightBehavior: true,
        //staticGraph: true,
        maxZoom: 1,
        minZoom: 0.3,
        node: {
            fontSize: 14,
            size: 120,
            labelProperty: 'label',
            highlightStrokeColor: 'blue',
            highlightFontSize: 14
        },
    }}
/>




const getLeveledTraces = trace => {
    let actualLevel = 1;
    let leveledTraces = [];

    Object.keys(trace).forEach((key, keyIndex, array) => {
        if(keyIndex === 0){
            leveledTraces.push({
                ref: key,
                level: actualLevel,
                traces: trace[key]
            });
            return;
        }

        const previousTrace = trace[array[keyIndex - 1]];
        console.log(previousTrace, previousTrace[previousTrace.length - 1].timestamp, trace[key][0].timestamp);

        if(previousTrace[previousTrace.length - 1].timestamp < trace[key][0].timestamp){
            actualLevel++;
        }

        leveledTraces.push({
            ref: key,
            level: actualLevel,
            traces: trace[key]
        })
    });

    return leveledTraces;
}

const traceExample = {
    //Trace id ref // Order by timestamp
    '01-23bdbbd23c': [
        {
            txHash: '1',
            type: 'produced',
            timestamp: 1,
            data: {}, //JSON with event data
            ref: null //Used to link to another trace
        },
        {
            txHash: '2',
            type: 'stored',
            timestamp: 5,
            data: {}, //JSON with event data
            ref: null //Used to link to another trace
        },
        {
            txHash: '222',
            type: 'stored',
            timestamp: 6,
            data: {}, //JSON with event data
            ref: '3' //Used to link to another trace
        },
    ],
    '01-23bdbbd24c': [
        {
            txHash: '8',
            type: 'produced',
            timestamp: 3,
            data: {}, //JSON with event data
            ref: null //Used to link to another trace
        },
        {
            txHash: '30',
            type: 'stored',
            timestamp: 5,
            data: {}, //JSON with event data
            ref: '3' //Used to link to another trace
        },
    ],
    '01-23bdbbd45c': [
        {
            txHash: '60',
            type: 'produced',
            timestamp: 3,
            data: {}, //JSON with event data
            ref: null //Used to link to another trace
        },
        {
            txHash: '61',
            type: 'stored',
            timestamp: 5,
            data: {}, //JSON with event data
            ref: '3' //Used to link to another trace
        },
    ],
    '01-23bdbbd23b' : [
        {
            txHash: '3',
            type: 'registration',
            timestamp: 12,
            data: {
                expirationDate: "1544896572",
                barcode: '2343249342342',
                batch: 'AE23GH',
                euCode: 'EU/1233446/27',
                ingredients: 'Leche pasteurizada de vaca, sal, cuajo y fermentos lácticos.',
                name: 'Queso de mezcla madurado',
                other: '',
                producer: 'Quesos CBX',
                weight: '400gr'
            },
            ref:  null //Used to link to another trace
        },
        {
            txHash: '4',
            timestamp: 7,
            type: 'loadUp',
            data: {}, //JSON with event data
            ref: null //Used to link to another trace
        },
        {
            txHash: '5',
            timestamp: 8,
            type: 'location',
            data: {}, //JSON with event data
            ref: null //Used to link to another trace
        },
        {
            txHash: '6',
            timestamp: 14,
            type: 'delivered',
            data: {}, //JSON with event data
            ref: '63' //Used to link to another trace
        },
    ],
    '01-23bdbbd80c': [
        {
            txHash: '63',
            type: 'prepared',
            timestamp: 20,
            data: {}, //JSON with event data
            ref: null //Used to link to another trace
        },
        {
            txHash: '64',
            type: 'eaten',
            timestamp: 25,
            data: {}, //JSON with event data
            ref: null //Used to link to another trace
        },
    ],
}
*/