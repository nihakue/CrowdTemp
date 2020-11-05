function Milestone({label, milestone, distance, topY, color, reverse=false, complete=false}) {
    const progressHeight = (reverse ? 1 - milestone : milestone) * distance;
    const progressTop = reverse? topY : topY + (distance - progressHeight)
    const x = reverse ? 97 : 0;
    const y = reverse ? progressTop + progressHeight : progressTop
    return (
        <g>
            <rect opacity={complete ? "1" : "0.7"} x="15" height={`${progressHeight}`} y={`${progressTop}`} width="100%" mask="url(#mask2)" fill={color}></rect>
            {label && <text style={{fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px'}} dominantBaseline="hanging" textAnchor="start" x={`${x}`} y={y + 2}>{label}</text> }
            {label && <line strokeDasharray={reverse ? '0' : '3'} x1={reverse ? 69 : x} y1={y+ 0.1} x2={reverse ? x + 35 : x + 65} y2={y} stroke="black" strokeWidth=".5"></line> }
        </g>
    )
}

export function Thermometer({progress=1, progressLabel="", milestones=[.25, .50, 1], labels=['15k', '30k', '45k']}) {
    const bottomY = 120.57;
    const topY = 6.9;
    const distance = bottomY - topY;
    const colors = ['#1b3f85', '#3b816c', '#b4b63b', 'rgb(211,144,68)'];
    const milestoneProgressRects = milestones.map((milestone, i) => <Milestone key={milestone} complete={milestone <= progress} label={labels[i] || ''} milestone={milestone} distance={distance} topY={topY} color={colors[i]} />)

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 140" preserveAspectRatio="xMinYMin meet">
            <mask id="mask2">
                <rect x="0" y="0" width="100%" height="100%" fill="black"></rect>
                <path d="M69,120.571999 q-.59,0 -1.185,-.033 a21.349,21.349 0 0 1 -19.879,-20.806 a21.1,21.1 0 0 1 10.293,-19.354 l3.89,-1.788 v-65.782 a4.881,4.881 0 1 1 11.762,0 v65.782 l3.89,1.788 a21.052,21.052 0 0 1 -8.771,40.193 " fill="white"></path>
                <Milestone complete={false} reverse label={""} milestone={progress} distance={distance} topY={topY} color={'black'} />
            </mask>
            <path d="M80.059998,74.059998 v-61.5 a11.56,11.56 0 0 0 -11.56,-11.56 a11.56,11.56 0 0 0 -11.56,11.559 v61.5 a27.743,27.743 0 1 0 23.12,0 " fill="#dbe2eb" visibility="visible"></path>
            {milestoneProgressRects.reverse()}
            <Milestone reverse label={progressLabel} milestone={progress} distance={distance} topY={topY} color={'transparent'} />
        </svg>
    )
}