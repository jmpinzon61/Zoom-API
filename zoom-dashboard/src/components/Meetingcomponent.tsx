import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createMeeting, getMeetingDetails, getMeetingParticipants, getCurrentParticipants } from '../zoomApi';
import { error } from 'console';
import { async } from "rxjs";




export const Meetingcomponent: React.FC = () => {
    const [meetingId, setmeetingId] = React.useState<string | null>(null);
    const queryClient = useQueryClient();

    const { data: meetingData, refetch: refetchMeetingDetails } = useQuery('meetingDetails', getMeetingDetails, {
        enabled: !!meetingId,
    });

    const { data: participants } = useQuery(
        ['participants', meetingId],
        () => getMeetingParticipants(meetingId!),
        { enabled: !!meetingId },
    );

    const { data: currentParticipants } = useQuery(
        ['currentParticipants', meetingId],
        () => getCurrentParticipants(meetingId!),
        { enabled: !!meetingId },
    );

    const createMutation = useMutation(createMeeting, {
        onSuccess: (data) => {
            setmeetingId(data.id);
            queryClient.invalidateQueries('meetingDetails');
        },
        onError: (error) => {
            console.log('Error al crear reunión: ', error);
        },
    });

    const handleCreateMeeting = async () => {
        try {
            await createMutation.mutateAsync({ topic: 'New Meeting', type: 1 });
        } catch (error) {
            console.log('Error al crear reunión: ', error);
        }
    };

    const handlefetchDetails = () => {
        if (meetingId) {
            refetchMeetingDetails();
        }
    }

    return (
        <div className='container mt-6'>
            <div className='mt-n5'>
            <button className='btn btn-primary' onClick={handleCreateMeeting} disabled={createMutation.isLoading}>
                {createMutation.isLoading ? 'Creating Meeting...' : 'Create Meeting'}
            </button>
            </div>
            {meetingData && (
                <div>
                    <h2>MeetingDetails</h2>
                    <p><strong>ID:</strong> {meetingData.id}</p>
                    <p><strong>Topic:</strong> {meetingData.topic}</p>
                    <p><strong>Status:</strong> {meetingData.status}</p>
                    <p><strong>Join URL:</strong> <a href={meetingData.join_url} target="_blank" rel="noopener noreferrer">Join Meeting</a></p>
                    <p><strong>Duration:</strong> {meetingData.duration} minutes</p>
                    {/* <pre>{JSON.stringify(meetingData, null, 2)}</pre> */}
                    {/* Esta etiqueta me da la mantencion de espacios y saltos de línea(Todo lo que este dentro de la misma) */}
                </div>/* stringify me da el value a formatear con opcional campo de arreglo y el tamaño de espacios en el cuerpo JSON */
            )}
            {participants && (
                <div>
                    <h2>Participants</h2>
                    <div className='table-responsive-sm'>
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {participants.map((participants: any) => ( */}
                                <tr>
                                    {/* <td>{participants.id}</td>
                                        <td>{participants.name}</td>
                                        <td>{participants.email}</td> */}
                                    <pre>{JSON.stringify(participants, null, 2)}</pre>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {currentParticipants && (
                <div>
                    <h2>CurrentParticipants</h2>
                    <div className='table-responsive-ms'>
                        <table className="table table-striped table-bordered">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* {currentParticipants.map((currentparticipants: any) => ( */}
                                <tr>
                                    {/* <td>{currentparticipants.id}</td>
                                        <td>{currentparticipants.name}</td>
                                        <td>{currentparticipants.email}</td> */}
                                    <pre>{JSON.stringify(currentParticipants, null, 2)}</pre>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Meetingcomponent;
