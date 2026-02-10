import { de } from 'date-fns/locale';
import { createLoader } from 'nuqs/server';
import { workflowsParams } from '../params';

const workflowsParamsLoader = createLoader(workflowsParams);

export default workflowsParamsLoader;
