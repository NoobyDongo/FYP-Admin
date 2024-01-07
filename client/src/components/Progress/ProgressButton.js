'use client';
import LoadingButton from "@/components/Progress/LoadingButton";
import useProgressListener from "../../utils/hooks/useProgress/useProgressListener";

export default function ProgressButton({ id, children, ...others }) {
    const { loading } = useProgressListener(id);
    return (
        <LoadingButton
            loading={loading}
            {...others}
        >
            <span>{children}</span>
        </LoadingButton>
    );
}
