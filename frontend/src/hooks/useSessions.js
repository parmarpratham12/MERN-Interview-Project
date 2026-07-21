import { useMutation , useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';




export const useCreateSession = () => {

const result = useMutation({
mutationKey:["createSession"],
mutationFn: sessionApi.createSession,
onSuccess:() => toast.success("Session Created successfully!"),
onError: (error) => toast.error(error.response?.data?.message || "Failed to create room" ),

});
return result
};

export const useActiveSessions = () => {
    const result = useQuery({
        queryKey:["activeSessions"],
        queryFn: sessionApi.getActiveSessions
    });
    return result;
};

export const useMyRecentSessions = () => {
    const result = useQuery({
        queryKey:["myRecentSessions"],
        queryFn: sessionApi.getActiveSessions,
    });
    return result;
};

export const useSessionById = (id) => {
    const result = useQuery({
        queryKey:["sessions", id],
        queryFn: () => sessionApi.getSessionById(id),
        enabled: !!id, // convert string to boolean
        refetchInterval:5000 // refetch every 5 second to detect session status changes

    });
    return result;
};

export const useJoinSession = (id) => {
    const result = useMutation({
        mutationKey: ["joinSession"],
        mutationFn:() => sessionApi.joinSession(id),
        onSuccess: () => toast.success("joined session successfully!"),
        onError:(error) => toast.error(error.response?.data?.message || "Failed to join session"),
    });
    return result
};

export const useEndSession = (id) => {
    const result = useMutation({
        mutationKey: ["endSession"],
        mutationFn:() => sessionApi.endSession(id),
        onSuccess: () => toast.success(" Session ended successfully!"),
        onError:(error) => toast.error(error.response?.data?.message || "Failed to end the session"),
    });
    return result
};