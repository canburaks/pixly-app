import React, { useState } from 'react'

import { useSpring, animated, useTransition } from 'react-spring'

export function anim() {
    const props = useSpring({ opacity: 1, from: { opacity: 0 } })
    const comp = <div>I will fade</div>
    return animated(comp)
}

export function TransitionComponent() {
    const [items, set] = useState([1,2,3,4,5])
    const transitions = useTransition(items, item => item, {
        from: { transform: 'translate3d(0,-40px,0)' },
        enter: { transform: 'translate3d(0,0px,0)' },
        leave: { transform: 'translate3d(0,-40px,0)' },
    })
    return transitions.map(({ item, props, key }) =>
        <animated.div key={key} style={props}>{item}</animated.div>
    )
}