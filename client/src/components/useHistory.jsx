'use client'
import React from 'react'
import IconButtonWithTooltip from './IconButtonWithTooltip'
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CancelIcon from '@mui/icons-material/Cancel';

export default function useHistory({ initialValue, valueSetter, comparator, disabled, removeAll }) {
    const history = React.useRef([initialValue])
    const pointer = React.useRef(history.current.length - 1)

    const numUndo = () => pointer.current
    const numRedo = () => history.current.length - pointer.current - 1

    const add = React.useCallback((value) => {
        console.log("history", pointer.current, history.current)
        const newValue = comparator(value)
        const currentValue = comparator(history.current[pointer.current])

        if (newValue.length !== currentValue.length || newValue.some((value, index) => value !== currentValue[index])) {
            history.current = history.current.slice(0, pointer.current + 1)
            history.current.push(value)
            pointer.current++
        }
        //console.log("new history", pointer.current, history.current)
    }, [comparator])

    const undo = React.useCallback(() => {
        //console.log("history", pointer.current, history.current)
        if (pointer.current > 0) {
            pointer.current--
            valueSetter(history.current[pointer.current])
        }
    }, [valueSetter])

    const redo = React.useCallback(() => {
        //console.log("history", pointer.current, history.current)
        if (pointer.current < history.current.length - 1) {
            pointer.current++
            valueSetter(history.current[pointer.current])
        }
    }, [valueSetter])

    const resetHistory = React.useCallback(() => {
        history.current = [[]]
        pointer.current = 0
    }, [])

    const renderTools = React.useCallback((props) => {
        const { enableDeleteAll, remove } = props || {}
        return [
            removeAll && (
                <IconButtonWithTooltip
                    key="removeAll"
                    label="Remove all"
                    disabled={!enableDeleteAll || disabled}
                    onClick={remove || removeAll}
                    color="error"
                >
                    <CancelIcon />
                </IconButtonWithTooltip>
            ),

            <IconButtonWithTooltip
                key="undo"
                label="Undo"
                disabled={numUndo() <= 0 || disabled}
                onClick={undo}
                color="primary"
            >
                <UndoIcon />
            </IconButtonWithTooltip>,

            <IconButtonWithTooltip
                key="redo"
                label="Redo"
                disabled={numRedo() <= 0 || disabled}
                onClick={redo}
                color="primary"
            >
                <RedoIcon />
            </IconButtonWithTooltip>,
        ]
    }, [pointer, disabled, removeAll]);

    return { history, pointer, add, undo, redo, numUndo, numRedo, renderTools, resetHistory }
}