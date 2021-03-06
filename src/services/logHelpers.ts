import { LogType } from '../contracts/log';

export function getLogTypeDescription(logType: LogType): string {
    switch (logType) {
        case 'ChallengeRoll':
            return 'Challenge roll';
        case 'UserInput':
            return 'User prompt';
        case 'ProgressRoll':
            return 'Progress roll';
    }
}
