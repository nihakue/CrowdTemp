import { useTheme } from "./theme";

function Milestone({label, milestone, distance, topY, color, isProgressMilestone=false, complete=false}) {
    const theme = useTheme();
    
    const progressHeight = (isProgressMilestone ? 1 - milestone : milestone) * distance;
    const progressTop = isProgressMilestone? topY : topY + (distance - progressHeight)
    const x = isProgressMilestone ? 97 : 0;
    const y = isProgressMilestone ? progressTop + progressHeight : progressTop
    const arrowSize = 2;
    return (
        <g>
            {isProgressMilestone && <polyline fill="none" strokeWidth=".5" stroke={theme.fill} points={`${72 + arrowSize}, ${y - arrowSize} ${72}, ${y} ${72 + arrowSize}, ${y + arrowSize}`}></polyline>}
            <rect opacity={complete ? "1" : "0.7"} x="15" height={`${progressHeight}`} y={`${progressTop}`} width="100%" mask="url(#mask2)" fill={color}></rect>
            {label && <text fill={theme.fill} style={{fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '11px'}} dominantBaseline="hanging" textAnchor="start" x={`${x}`} y={y + 2}>{label}</text> }
            {label && <line strokeDasharray={isProgressMilestone ? '0' : '3'} x1={isProgressMilestone ? 72 : x} y1={y+ 0.1} x2={isProgressMilestone ? x + 35 : x + 65} y2={y} stroke={theme.fill} strokeWidth=".5"></line> }
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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 130" preserveAspectRatio="xMinYMin meet">
            <mask id="mask2">
                <rect x="0" y="0" width="100%" height="100%" fill="black"></rect>
                <path d="M69,120.571999 q-.59,0 -1.185,-.033 a21.349,21.349 0 0 1 -19.879,-20.806 a21.1,21.1 0 0 1 10.293,-19.354 l3.89,-1.788 v-65.782 a4.881,4.881 0 1 1 11.762,0 v65.782 l3.89,1.788 a21.052,21.052 0 0 1 -8.771,40.193 " fill="white"></path>
                <Milestone complete={false} isProgressMilestone label={""} milestone={progress} distance={distance} topY={topY} color={'black'} />
            </mask>
            <path d="M80.059998,74.059998 v-61.5 a11.56,11.56 0 0 0 -11.56,-11.56 a11.56,11.56 0 0 0 -11.56,11.559 v61.5 a27.743,27.743 0 1 0 23.12,0 " fill="#dbe2eb" visibility="visible"></path>
            {milestoneProgressRects.reverse()}
            <Milestone isProgressMilestone label={progressLabel} milestone={progress} distance={distance} topY={topY} color={'transparent'} />
        </svg>
    )
}