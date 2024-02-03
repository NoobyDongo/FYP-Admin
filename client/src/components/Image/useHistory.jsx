'use client'
import { useRef } from 'react'

export default (initialValue, valueSetter, comparator) => {
    const history = useRef([initialValue])
    const pointer = useRef(history.current.length - 1)

    const numUndo = () => pointer.current
    const numRedo = () => history.current.length - pointer.current - 1

    const add = (value) => {
        console.log("history", pointer.current, history.current)
        const newValue = comparator(value)
        const currentValue = comparator(history.current[pointer.current])

        if (newValue.length !== currentValue.length || newValue.some((value, index) => value !== currentValue[index])) {
            history.current = history.current.slice(0, pointer.current + 1)
            history.current.push(value)
            pointer.current++
        }
        console.log("new history", pointer.current, history.current)
    }

    const undo = () => {
        console.log("history", pointer.current, history.current)
        if (pointer.current > 0) {
            pointer.current--
            valueSetter(history.current[pointer.current])
        }
    }

    const redo = () => {
        console.log("history", pointer.current, history.current)
        if (pointer.current < history.current.length - 1) {
            pointer.current++
            valueSetter(history.current[pointer.current])
        }
    }

    return { history, pointer, add, undo, redo, numUndo, numRedo }
}