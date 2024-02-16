'use client'
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import React from 'react'
import TransitionGroup from 'react-transition-group/TransitionGroup';

export default function DynamicText({ event, placeholder = "" }) {
    const [text, setText] = React.useState(placeholder.split('').map(str => str.replace(/ /g, '\u00A0\u00A0')))

    const handleEvent = (e) => {
        setText((e.detail.text || "").split('').map(str => str.replace(/ /g, '\u00A0\u00A0')))
    }

    React.useEffect(() => {
        window.addEventListener(event, handleEvent)
        return () => {
            window.removeEventListener(event, handleEvent)
        }
    }, [event])

    return (
        <Fade in={Boolean(text.length > 0)}>
            <div>
                <TransitionGroup style={{
                    display: "flex",
                    flexDirection: "row",
                    overflow: 'hidden'
                }}>
                    {text.map((e, index) => (
                        <Collapse orientation='horizontal' in={true} key={e + index}>
                            <span>
                                {e}
                            </span>
                        </Collapse>
                    ))}
                </TransitionGroup>
            </div>
        </Fade>
    )
}
