import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;



@Injectable()
export class DC3Service {

    constructor(
        private http: HttpClient
    ) { }

    formatDateToSpanish(date: Date): string {
        moment.locale('es');
        return moment(date).format('dddd, D [de] MMMM [de] YYYY');
    }

    pdf(data: any) {

        const dd:any = {
            pageSize: 'LETTER',
            defaultStyle: {
                fontSize: 9
            },
            content: [
                // Línea divisoria después de cada mensajería
                {
                    canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 1, lineColor: '#cccccc' }],
                    margin: [0, 10, 0, 10] // Margen para separar de la siguiente mensajería
                },
                {
                    text: 'Impresión de Orden de fabricación',
                    alignment: 'center',
                    bold: true
                },


                {
                    text: `Etiquetas Electrónicas de Occidente, S.A. de C.V.`,
                    alignment: 'center'
                },
                '\n',
                {
                    columns: [
                        {
                            width: '50%',
                            text: `Número de órden: ${data.noOrden}`,
                            bold: true,
                            alignment: 'left'
                        },
                        {
                            width: '50%',
                            text: `Fecha de fabricación: ${this.formatDateToSpanish(data.fechaInicio)}`,
                            bold: true,
                            alignment: 'right'
                        }
                    ]
                },
                '\n',
                {
                    canvas: [{ type: 'line', x1: 0, y1: 5, x2: 515, y2: 5, lineWidth: 2 }] // Línea divisoria
                },
                '\n',
                {
                    columns: [
                        {
                            // Primera columna
                            width: '50%',
                            stack: [
                                {
                                    text: [
                                        { text: 'Tipo de fabricación: ', bold: true },
                                        `Ordinaria`
                                    ],
                                    margin: [0, 0, 0, 10] // Margen inferior para separar de la siguiente entrada
                                },
                                {
                                    text: [
                                        { text: 'Fecha de solicitud: ', bold: true },
                                        `${this.formatDateToSpanish(data.fechaInicio)}`
                                    ]
                                }
                            ]
                        },
                        {
                            // Segunda columna
                            width: '50%',
                            stack: [
                                {
                                    text: [
                                        { text: ' Clave interna: ', bold: true },
                                        'XCF3-2024-001'
                                    ],
                                    margin: [0, 0, 0, 10] // Margen inferior para separar de la siguiente entrada
                                },
                                {
                                    text: [
                                        { text: 'Nombre del responsable: ', bold: true },
                                        'René Soria García'
                                    ]
                                }
                            ]
                        }
                    ]
                },
                '\n',

                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'DATOS DEL CLIENTE',
                                    fontSize: 10,
                                    bold: true,
                                    alignment: 'center',
                                    fillColor: '#eeeeee', // Color de fondo gris claro
                                    margin: [0, 3, 0, 3] // Margen dentro de la celda
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders' // Sin bordes para la tabla
                },


                // Datos del cliente en dos columnas
                {
                    columns: [
                        {
                            // Primera columna
                            width: '50%',
                            stack: [
                                {
                                    text: [
                                        { text: 'Nombre: ', bold: true },
                                        `${data.clienteId[0].nombre}`
                                    ],
                                    margin: [0, 0, 0, 10] // Margen inferior
                                },
                                {
                                    text: [
                                        { text: 'RFC: ', bold: true },
                                        `${data.clienteId[0].rfc}`
                                    ],
                                    margin: [0, 0, 0, 10] // Margen inferior
                                },
                                {
                                    text: [
                                        { text: 'Dirección: ', bold: true },
                                        `N/A`
                                    ],
                                    margin: [0, 0, 0, 10] // Margen inferior
                                },
                                {
                                    text: [
                                        { text: 'Código Postal: ', bold: true },
                                        `N/A`
                                    ]
                                }
                            ]
                        },
                        {
                            // Segunda columna
                            width: '50%',
                            stack: [
                                {
                                    text: [
                                        { text: 'Colonia: ', bold: true },
                                        `N/A`
                                    ],
                                    margin: [0, 0, 0, 10] // Margen inferior
                                },
                                {
                                    text: [
                                        { text: 'Municipio: ', bold: true },
                                        `N/A`
                                    ],
                                    margin: [0, 0, 0, 10] // Margen inferior
                                },
                                {
                                    text: [
                                        { text: 'Estado: ', bold: true },
                                        `N/A`
                                    ],
                                    margin: [0, 0, 0, 10] // Margen inferior
                                },

                            ]
                        }
                    ]
                },
                '\n',

                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'DETALLES DE LA FABRICACIÓN',
                                    fontSize: 10,
                                    bold: true,
                                    alignment: 'center',
                                    fillColor: '#eeeeee', // Color de fondo gris claro
                                    margin: [0, 3, 0, 3] // Margen dentro de la celda
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders' // Sin bordes para la tabla
                },
                {
                    columns: [
                        {
                            // Primera columna
                            width: '50%',
                            stack: [
                                {
                                    text: [
                                        { text: 'Detalles del color: ', bold: true },
                                        `${data.metodologia}`
                                    ],
                                    margin: [0, 0, 0, 10] // Margen inferior
                                },
                            ]
                        },
                        {
                            // Segunda columna
                            width: '50%',
                            stack: [
                                {
                                    text: [
                                        { text: 'Suaje: ', bold: true },
                                        `${data.objetivo}`
                                    ],
                                    margin: [0, 0, 0, 10] // Margen inferior
                                },


                            ]
                        }
                    ]
                },

                '\n',
                {
                    table: {
                        widths: ['*'],
                        body: [
                            [
                                {
                                    text: 'OBSERVACIONES',
                                    fontSize: 10,
                                    bold: true,
                                    alignment: 'center',
                                    fillColor: '#eeeeee', // Color de fondo gris claro
                                    margin: [0, 3, 0, 3] // Margen dentro de la celda
                                }
                            ]
                        ]
                    },
                    layout: 'noBorders' // Sin bordes para la tabla
                },
                { text: `${data.practica}` },



            ],

        }

        pdfMake.createPdf(dd).download(`${data.noOrden}-orden-fabricacion.pdf`);

    }


}