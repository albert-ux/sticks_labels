import { Injectable } from '@angular/core';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  uploadFile(path: string, file: File): Observable<any> {
    const storage = getStorage();
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Crear un Observable para manejar el proceso de carga y obtener la URL de descarga
    return new Observable(observer => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next({
            status: 'progress',
            percentage: progress
          });
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          observer.error(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(storageRef);
            observer.next({
              status: 'completed',
              url: downloadURL
            });
            observer.complete();
          } catch (error) {
            observer.error(error);
          }
        }
      );
    });
  }

  deleteFile(path: string): Observable<any> {
    const storage = getStorage();
    const storageRef = ref(storage, path);

    return new Observable(observer => {
      deleteObject(storageRef)
        .then(() => {
          observer.next({
            status: 'completed'
          });
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

}
