export class Backup {
    async makeBackup(dbname: string){
        await Deno.copyFile('./databases/'.concat(dbname), './backups/'.concat('backup_'.concat(dbname)));
    }
}