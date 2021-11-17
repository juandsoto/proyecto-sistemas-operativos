import * as inquirer from 'inquirer';
import { Input, Info } from '../interfaces/interfaces';

export const getInput = async (): Promise<Input> => {
  const choice: Input = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'eleccion',
        message: 'Elija una opción',
        choices: [
          {
            value: 1,
            name: '1. Generar al azar los datos necesarios para la simulacion'
          },
          {
            value: 2,
            name: '2. Permitir que el usuario digite desde el teclado los datos necesarios para la simulación'
          }
        ]
      },
      {
        type: 'input',
        name: 'numeroDeProcesos',
        message: 'Número de procesos',
        validate: (input, _) => {
          if (input < 0) {
            return 'Debe ser igual o mayor a 0';
          }
          if (isNaN(parseInt(input))) return 'Debe ser un número';

          return true;
        }
      },
      {
        type: 'list',
        name: 'algoritmo',
        message: 'Algoritmo a utilizar en la cola de menor prioridad',
        choices: [
          {
            value: 'fcfs',
            name: '1. FCFS'
          },
          {
            value: 'sjn',
            name: '2. SJN'
          },
          {
            value: 'hrn',
            name: '3. HRN'
          }
        ]
      }
    ])
    .then(answers => answers);
  return choice;
};

export const getInfo = async (): Promise<Info> => {
  const info: Info = await inquirer
    .prompt([
      {
        type: 'input',
        name: 'llegada',
        message: 'Instante de llegada',
        validate: (input, _) => {
          if (input < 0) {
            return 'Debe ser igual o mayor a 0';
          }
          if (isNaN(parseInt(input))) return 'Debe ser un número';

          return true;
        }
      },
      {
        type: 'input',
        name: 'prioridad',
        message: 'Indique la prioridad',
        validate: (input, _) => {
          if (input < 0) {
            return 'Debe ser igual o mayor a 0';
          }
          if (isNaN(parseInt(input))) return 'Debe ser un número';

          return true;
        }
      },
      {
        type: 'input',
        name: 'CPU1',
        message: 'Primera ráfaga de CPU',
        validate: (input, _) => {
          if (input < 0) {
            return 'Debe ser igual o mayor a 0';
          }
          if (isNaN(parseInt(input))) return 'Debe ser un número';

          return true;
        }
      },
      {
        type: 'input',
        name: 'ES',
        message: 'Ráfaga de E/S',
        validate: (input, _) => {
          if (input < 0) {
            return 'Debe ser igual o mayor a 0';
          }
          if (isNaN(parseInt(input))) return 'Debe ser un número';

          return true;
        }
      },
      {
        type: 'input',
        name: 'CPU2',
        message: 'Segunda ráfaga de CPU',
        validate: (input, _) => {
          if (input < 0) {
            return 'Debe ser igual o mayor a 0';
          }
          if (isNaN(parseInt(input))) return 'Debe ser un número';

          return true;
        }
      }
    ])
    .then(
      (answers): Info =>
        answers.eleccion === 1
          ? answers
          : {
              eleccion: parseInt(answers.eleccion),
              llegada: parseInt(answers.llegada),
              prioridad: parseInt(answers.prioridad),
              CPU1: parseInt(answers.CPU1),
              ES: parseInt(answers.ES),
              CPU2: parseInt(answers.CPU2)
            }
    );
  return info;
};
