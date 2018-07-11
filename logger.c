#include <stdio.h>
#include <string.h>

unsigned long hashCode(char *str);
void printLog();
void writeToLog();
int integrityCheck();

typedef int bool;
#define TRUE 1;
#define FALSE 0;

int main(int argc, char **argv)
{
    char *log = argv[1];
    //printf("Hash code of %s is %lu \n", log, hashCode(log));
    //return 0;
    if (strcmp(log, "read") == 0)
        printLog();
    else
        writeToLog(log);

    return 0;
}

void printLog()
{
    int result = integrityCheck();
    if( result == 0 ){
        printf("\nAdmin log file has been tempered with:...\n");
        return;
    }

    FILE *file = fopen("admin.log", "r");

    char line[256];

    while (fgets(line, sizeof(line), file))
    {
        printf("%s", line);
    }
    fclose(file);
}

void writeToLog(char *log)
{

    int result = integrityCheck();
    if( result == 0 ){
        return;
    }
    
    FILE *file = fopen("admin.log", "r+");
    char lastLine[255];

    // This loop is needed to get to the last list and grab its hash code
    while (fgets(lastLine, sizeof(lastLine), file))
    {
        ;
    }

    char *lastLogMessage = strtok(lastLine, ":");
    char *lastMessageHash = strtok(NULL, ":");

    char chainedLogMessage[512];
    char clearChainedLogMessage[512];
    int count=0;

    sprintf(chainedLogMessage,"%s%s",log, lastMessageHash);

    // remove new line char
    for(int i=0; chainedLogMessage[i] != '\0';++i){
        if(chainedLogMessage[i] != '\n')
            clearChainedLogMessage[count++] = chainedLogMessage[i];
    }
    clearChainedLogMessage[count]='\0';

    fprintf(file, "%s:%lu\n", log, hashCode(clearChainedLogMessage));

    fclose(file);
}

int integrityCheck()
{
    FILE *file = fopen("admin.log", "r");
    int count = 0;
    
    char line[256];

    bool valid = TRUE;

    char *currentLog;
    char *currentHashCode;

    char log[255];
    char var2[255];
    char prevHash[255];
    char hash[255];

    char testHashCode[255];
    char chainedLogMessage[255];
    char clearChainedLogMessage[255];

    while (fgets(line, sizeof(line), file))
    {

        int idx = 0;

        // Get the current log message
        strcpy(log, strtok(line, ":"));

        // Get a hash code associated with the current message
        strcpy(var2, strtok(NULL, ":"));

        for(int i=0; var2[i] != '\0'; i++){
            if(var2[i] != '\n')
                hash[idx++] = var2[i];
        }
        hash[idx]='\0';

        // skip first record and record the hash code
        if (count == 0)
        {
            strcpy(prevHash, hash);
            count++;
            continue;
        }
              
        //puts(log); // current log message
        //puts(hash); // current hash
        //puts(prevHash); // previous hash

        // Adds previous record's hashcode to the current log messages
        sprintf(chainedLogMessage,"%s%s",log, prevHash);

        sprintf(testHashCode, "%lu", hashCode(chainedLogMessage));
        //puts(testHashCode);

        strcpy(prevHash, hash);

        // Test if there is a match 0 return is equal
        if (strcmp(hash, testHashCode))
        {
            //puts("MISMATCH");
            valid = FALSE;
            break;
        }

    }

    return valid;
}

// Hashing function by Dan J. Bernstein
unsigned long hashCode(char *str)
{
    unsigned long hash = 5381;
    int c;

    while ((c = *str++))
        hash = ((hash << 5) + hash) + c;

    return hash;
}
