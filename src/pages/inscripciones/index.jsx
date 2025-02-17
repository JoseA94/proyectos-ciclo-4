import React, { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import PrivateRoute from 'components/PrivateRoute';
import { GET_INSCRIPCIONES } from 'graphql/inscripciones/queries';
import { APROBAR_INSCRIPCION,RECHAZAR_INSCRIPCION } from 'graphql/inscripciones/mutaciones';
import ButtonLoading from 'components/ButtonLoading';
import { toast } from 'react-toastify';
import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from 'components/Accordion';

const IndexInscripciones = () => {
  const { data, loading, error, refetch } = useQuery(GET_INSCRIPCIONES);

  useEffect(() => {
    console.log("esto es el data que llega de inscripciones",data);
  }, [data]);
  if (loading) return <div>Loading...</div>;
  return (
    <PrivateRoute roleList={['LIDER']}>
      {data? (
        <>
      <div className='p-10'>
        <div className='flex w-full items-center justify-center'>
        <h1 className='text-white text-2xl font-bold '>Pagina de inscripciones</h1>
        </div>
        
        <div className='my-4'>
          <AccordionInscripcion
            titulo='Inscripciones aprobadas'
            data={data.Inscripciones.filter((el) => el.estado === 'ACEPTADO')}
          />
          <AccordionInscripcion
            titulo='Inscripciones pendientes'
            data={data.Inscripciones.filter((el) => el.estado === 'PENDIENTE')}
            refetch={refetch}
          />
          <AccordionInscripcion
            titulo='Inscripciones rechazadas'
            data={data.Inscripciones.filter((el) => el.estado === 'RECHAZADO')}
          />
        </div>
      </div>
      </>):(<>
      <div>No eres un lider, mensaje de seguridad por si no tienes el rol del LIDER</div></>)}
    </PrivateRoute>
  );
};

const AccordionInscripcion = ({ data, titulo, refetch = () => {} }) => {
  return (
    <AccordionStyled>
      <AccordionSummaryStyled>
        {titulo} ({data.length})
      </AccordionSummaryStyled>
      <AccordionDetailsStyled>
        <div className='flex'>
          {data &&
            data.map((inscripcion) => {
              return <Inscripcion inscripcion={inscripcion} refetch={refetch} />;
            })}
        </div>
      </AccordionDetailsStyled>
    </AccordionStyled>
  );
};

const Inscripcion = ({ inscripcion, refetch }) => {
  const [aprobarInscripcion, { data, loading, error }] = useMutation(APROBAR_INSCRIPCION);
  const [rechazarInscripcion, {data: dataMutation,loading: loadingMutation,error: errorMutation}] =useMutation(RECHAZAR_INSCRIPCION);

  useEffect(() => {
    if (data) {
      toast.success('Inscripcion aprobada con exito');
      refetch();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('Error aprobando la inscripcion');
    }
  }, [error]);

  const cambiarEstadoInscripcion = () => {
    aprobarInscripcion({
      variables: {
        aprobarInscripcionId: inscripcion._id,
      },
    });
  };
  
  //Lo mismo para el botón de rechazar inscripcion 

  useEffect(() => {
    if (dataMutation) {
      toast.success('Inscripcion RECHAZADA con exito');
      refetch();
    }
  }, [dataMutation]);

  useEffect(() => {
    if (errorMutation) {
      toast.error('Error aprobando la inscripcion');
    }
  }, [errorMutation]);

  const rechazarEstadoInscripcion = () => {
    rechazarInscripcion({
      variables: {
        rechazarInscripcionId: inscripcion._id,
      },
    });
  };
  
  return (
    <div className='bg-gray-900 text-gray-50 flex flex-col p-6 m-2 rounded-lg shadow-xl'>
      <span>{inscripcion.proyecto.nombre}</span>
      <span>{inscripcion.estudiante.nombre}</span>
      <span>{inscripcion.estado}</span>
      {inscripcion.estado === 'PENDIENTE' && (
        <>
        <ButtonLoading
          onClick={() => {
            cambiarEstadoInscripcion();
          }}
          text='Aprobar Inscripcion'
          loading={loading}
          disabled={false}
        />

        <ButtonLoading
        onClick={() => {
          rechazarEstadoInscripcion();
        }}
        text='Rechazar Inscripcion'
        loading={loadingMutation}
        disabled={false}
      />
        </>
        
        
      )}
    </div>
  );
};

export default IndexInscripciones;
