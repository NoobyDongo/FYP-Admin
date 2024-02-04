'use client';
import LinearProgress from "@mui/material/LinearProgress";
import Slide from "@mui/material/Slide";
import useProgressListener from "./useProgress/useProgressListener";

const barHeight = 0.3;

export default function ProgressBar({ id }) {
    const { loading } = useProgressListener(id);

    return (
        <>
            <Slide direction="down" in={loading} timeout={250}>
                <div>
                    <LinearProgress sx={{ height: barHeight, position: "absolute", top: 0, width: 1, zIndex: 1000 }} />
                </div>
            </Slide>
        </>
    );
}
