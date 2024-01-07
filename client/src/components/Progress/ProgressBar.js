'use client';
import { LinearProgress, Slide } from "@mui/material";
import useProgressListener from "../../utils/hooks/useProgress/useProgressListener";

const barHeight = 0.3;

export default function ProgressBar({ id }) {
    const { loading } = useProgressListener(id);

    return (
        <>
            <Slide direction="down" in={loading} timeout={250}>
                <LinearProgress sx={{ height: barHeight, position: "absolute", top: 0, width: 1 }} variant="determinate" value={0} />
            </Slide>
            {loading && <LinearProgress sx={{ height: barHeight }} />}
        </>
    );
}
