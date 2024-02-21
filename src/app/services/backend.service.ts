import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, docData, collection, doc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, getDocs, getDoc, where, onSnapshot, DocumentReference, setDoc } from '@angular/fire/firestore';
import { Observable, combineLatest, from, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  firestore: Firestore;

  constructor(
  ) {
    this.firestore = inject(Firestore);
  }

  createCurso(data: any): Promise<any> {
    const cursosCollection = collection(this.firestore, 'cursos');
    return addDoc(cursosCollection, data);
  }

  getCursos(): Observable<any> {
    const cursosCollection = collection(this.firestore, 'cursos');
    return from(getDocs(cursosCollection)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      })
    );
  }

  getCursoById(id: string): Observable<any> {
    const cursoDoc = doc(this.firestore, 'cursos', id);
    return docData(cursoDoc, { idField: 'docId' });
  }

  getOrdenById(id: string): Observable<any> {
    const cursoDoc = doc(this.firestore, 'ordenes', id);
    return docData(cursoDoc, { idField: 'docId' }).pipe(
      map((data:any) => {
        if (data?.fechaFin) {
          data.fechaFin = data.fechaFin.toDate();
        }
        if (data?.fechaInicio) {
          data.fechaInicio = data.fechaInicio.toDate();
        }
        return data;
      })
    );
    }


  updateCurso(id: string, data: any): Promise<void> {
    const cursoDoc = doc(this.firestore, 'cursos', id);
    return updateDoc(cursoDoc, data);
  }

  deleteCurso(id: string): Promise<void> {
    const cursoDoc = doc(this.firestore, 'cursos', id);
    return deleteDoc(cursoDoc);
  }

  createTutor(data: any): Promise<any> {
    const tutoresCollection = collection(this.firestore, 'tutores');
    return addDoc(tutoresCollection, data);
  }

  getTutor(id: string): Observable<any> {
    const tutorDoc = doc(this.firestore, 'tutores', id);
    return docData(tutorDoc, { idField: 'docId' });
  }

  updateTutor(id: string, data: any): Promise<void> {
    const tutorDoc = doc(this.firestore, 'tutores', id);
    return updateDoc(tutorDoc, data);
  }

  deleteTutor(id: any): Promise<void> {
    const tutorDoc = doc(this.firestore, 'tutores', id);
    return deleteDoc(tutorDoc);
  }

  getTutores(): Observable<any> {
    const tutoresCollection = collection(this.firestore, 'tutores');
    return from(getDocs(tutoresCollection)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      })
    );
  }

  createOrden(data: any): Promise<any> {
    const ordenesCollection = collection(this.firestore, 'ordenes');
    return addDoc(ordenesCollection, data);
  }

  updateOrden(data: any, id: string): Promise<void> {
    const ordenRef = doc(this.firestore, 'ordenes', id);
    return updateDoc(ordenRef, data);
  }

  async setorden(data: any, id: string): Promise<void> {
    const ordenRef = doc(this.firestore, 'ordenes', id);
    return await setDoc(ordenRef, data, { merge: true });
}

  deleteOrden(id: string): Promise<void> {
    const ordendoc = doc(this.firestore, 'ordenes', id);
    return deleteDoc(ordendoc);
  }

  getLastNoOrden(): Observable<any> {
    const ordenesQuery = query(collection(this.firestore, 'ordenes'), orderBy('noOrden', 'desc'), limit(1));
    return collectionData(ordenesQuery, { idField: 'docId' });
  }

  getOrdenes(): Observable<any> {
    const ordenesCollection = collection(this.firestore, 'ordenes');
    return from(getDocs(ordenesCollection)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      })
    );


  }

  createCliente(cliente: any): Promise<any> {
    const clientCollection = collection(this.firestore, 'clientes');
    return addDoc(clientCollection, cliente);
  }

  deleteCliente(clienteId: string): Promise<void> {
    const clientDocRef = doc(this.firestore, 'clientes', clienteId);
    return deleteDoc(clientDocRef);
  }

  getClientes(): Observable<any[]> {
    const clientesCollection = collection(this.firestore, 'clientes');
    return from(getDocs(clientesCollection)).pipe(
      map(snapshot => {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      })
    );
  }

  getCliente(id: string): Observable<any> {
    const clienteDocRef = doc(this.firestore, 'clientes', id);
    return from(getDoc(clienteDocRef)).pipe(
      map(docSnapshot => {
        if (docSnapshot.exists()) {
          return { id: docSnapshot.id, ...docSnapshot.data() };
        } else {
          // Manejar el caso en el que el cliente con ese ID no exista, si es necesario
          throw new Error('Cliente no encontrado');
        }
      })
    );
  }

  async updateCliente(id: string, data: any): Promise<void> {
    const clienteDocRef = doc(this.firestore, 'clientes', id);
    await updateDoc(clienteDocRef, data);
  }


  getFilesOfAsesor(asesorId: string): Observable<any[]> {
    const q = query(collection(this.firestore, 'files_asesor'), where('asesorId', '==', asesorId));

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const files = snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
        observer.next(files);
      });

      // La desuscripción se llama cuando no hay más suscriptores
      return () => unsubscribe();
    });
  }


  getFilesOfCliente(clienteId: string): Observable<any[]> {
    const q = query(collection(this.firestore, 'files_cliente'), where('clienteId', '==', clienteId));

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const files = snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id }));
        observer.next(files);
      });

      // La desuscripción se llama cuando no hay más suscriptores
      return () => unsubscribe();
    });
  }


  async addFileToAsesor(asesorId: string, fileData: any): Promise<void> {
    // Adjuntamos el ID del asesor al objeto de datos del archivo.
    const data = {
      ...fileData,
      asesorId: asesorId
    };

    // Guardamos el archivo en Firestore.
    await addDoc(collection(this.firestore, 'files_asesor'), data);
  }

  deleteFileOfAsesor(fileId: string): Promise<void> {
    const fileRef = doc(this.firestore, 'files_asesor', fileId);
    return deleteDoc(fileRef);
  }


  async addFileToCliente(clienteId: string, fileData: any): Promise<void> {
    // Adjuntamos el ID del asesor al objeto de datos del archivo.
    const data = {
      ...fileData,
      clienteId: clienteId
    };

    // Guardamos el archivo en Firestore.
    await addDoc(collection(this.firestore, 'files_cliente'), data);
  }

  deleteFileOfCliente(fileId: string): Promise<void> {
    const fileRef = doc(this.firestore, 'files_cliente', fileId);
    return deleteDoc(fileRef);
  }

  createTutorCurso(tutorId: string, cursoId: string): Promise<DocumentReference> {
    const tutorCursosCollection = collection(this.firestore, 'tutorCursos');
    return addDoc(tutorCursosCollection, { tutorId, cursoId });
  }

  getCursosByTutorId(tutorId: any): Observable<any[]> {
    const tutorCursosCollection = collection(this.firestore, 'tutorCursos');
    const tutorCursosQuery = query(tutorCursosCollection, where('tutorId', '==', tutorId));
    return collectionData(tutorCursosQuery).pipe(
      switchMap(tutorCursos => {
        if (tutorCursos.length === 0) { // Verificar si tutorCursos es un array vacío.
          return of([]); // Devolver un observable de un array vacío.
        }
        const cursoIds = tutorCursos.map((tc: any) => tc.cursoId);
        const cursoQueries = cursoIds.map(cursoId => doc(this.firestore, 'cursos', cursoId));
        return combineLatest(
          cursoQueries.map(cursoQuery =>
            docData(cursoQuery).pipe(
              map(curso => ({
                id: cursoQuery.id, // agregar el id del documento aquí
                ...curso
              }))
            )
          )
        );
      })
    );
  }
  
  
  getTutoresByCursoId(cursoId: string): Observable<any[]> {
    const tutorCursosCollection = collection(this.firestore, 'tutorCursos');
    const tutorCursosQuery = query(tutorCursosCollection, where('cursoId', '==', cursoId));
    return collectionData(tutorCursosQuery).pipe(
      switchMap(tutorCursos => {
        if (tutorCursos.length === 0) { // Verificar si tutorCursos es un array vacío.
          return of([]); // Devolver un observable de un array vacío.
        }
        const tutorIds = tutorCursos.map((tc: any) => tc.tutorId);
        const tutorQueries = tutorIds.map(tutorId => doc(this.firestore, 'tutores', tutorId));
        return combineLatest(
          tutorQueries.map(tutorQuery =>
            docData(tutorQuery).pipe(
              map(tutor => ({
                id: tutorQuery.id, // agregar el id del documento aquí
                ...tutor
              }))
            )
          )
        );
      })
    );
  }
  

  
  addCursoToTutor(tutorId: string, cursoId: string) {
    const tutorCurso = {
      tutorId: tutorId,
      cursoId: cursoId
    };
    return addDoc(collection(this.firestore, 'tutorCursos'), tutorCurso);
  }

  removeCursoFromTutor(tutorId: string, cursoId: string): Promise<void> {
    const tutorCursosCollection = collection(this.firestore, 'tutorCursos');
    const tutorCursoQuery = query(tutorCursosCollection, where('tutorId', '==', tutorId), where('cursoId', '==', cursoId));
    return new Promise((resolve, reject) => {
      collectionData(tutorCursoQuery, { idField: 'id' }).pipe( // Añadir { idField: 'id' } aquí
        first()
      ).subscribe({
        next: (tutorCursos: any) => {
          if (tutorCursos && tutorCursos.length > 0) {
            const tutorCursoId = tutorCursos[0].id; // Ahora tutorCursos[0] debe tener una propiedad id.
            deleteDoc(doc(this.firestore, 'tutorCursos', tutorCursoId)).then(resolve).catch(reject);
          } else {
            reject('Curso no encontrado para el tutor especificado.');
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
    
    
  }


}
