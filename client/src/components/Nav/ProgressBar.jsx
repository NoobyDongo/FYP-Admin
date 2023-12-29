import { useProgressListener } from "@/hooks/useProgress";
import { stateTransitionMixin } from "@/style/TransitionMixin";
import { LinearProgress } from "@mui/material";

const CustomProgressBar = stateTransitionMixin({
    component: LinearProgress,
    transition: "opacity", 
    onOpen: {opacity: 1},
    onClose: {opacity: 0}
})

export default function ProgressBar(){
    const { loading } = useProgressListener()

    return (
        <CustomProgressBar state={loading} />
    )
}