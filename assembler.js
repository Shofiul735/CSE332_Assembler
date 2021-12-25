// JS file system dependency 
const fs = require('fs');

// Reading data from files
let insArr = fs.readFileSync('instructions.txt',{encoding:'utf-8'}).split('\n');
let regArr = fs.readFileSync('registers.txt',{encoding:'utf-8'}).split('\n');
let inputArr = fs.readFileSync('input.txt',{encoding:'utf-8'}).split('\n').map(item=>item.trim()).filter(item=>item.length>0);

// variables declearation
let instructions = {};
let registers = {};
let command,comAndReg,reg;
let lineCount=1;
let binaryCode="";
let assemError = false;
let jump = {};
let j = 0;
// Helper functions block start
const arrayToObject = (arr,obj)=>{
    for(let item of arr){
        let temp = item.split(' ');
        temp = temp.map(item=>item.trim());
        if(temp[0].length>0)obj[temp[0]] = temp[1];
    }
}

const machineCode = (command,reg)=>{
    switch(command){
        case 'add':
        case 'sub':
        case 'and':
        case 'or':
        case 'xor':
            if(registers[reg[1]] && registers[reg[2]] && registers[reg[0]]){
                binaryCode += instructions[command]+' ';
                binaryCode += registers[reg[1]] + ' ' + registers[reg[2]]
                         + ' ' + registers[reg[0]]+'\n';
                return true;
            }else{
                return false;
            }

        case 'addi':
        case 'srl':
        case 'sll':
            if(registers[reg[0]] && registers[reg[1]]){
                binaryCode += instructions[command]+' ';
                binaryCode += registers[reg[0]]+' '+ registers[reg[1]]+' ';
                let bin;
                if(Number.parseInt(reg[2])!= NaN){
                    bin = Number.parseInt(reg[2]).toString(2);
                }else{
                    console.log(`Error: Not a Number!`);
                    return false;
                }
                if(bin.length>0 && bin.length<3){
                    if(bin.length === 1){
                        binaryCode+= '0'+bin+'\n';
                    }else{
                        binaryCode+=bin+'\n';
                    }
                    return true;
                }else{
                    console.log(`number excide maximum bit`);
                }
            }
            return false;
        
        case 'J':
            binaryCode+=instructions[command]+' ';
            if(jump[reg[0]]!=undefined){
                let str='';
                let zeros = 6-jump[reg[0]].length;
                for(let i=0;i<zeros;i++){
                     str+='0';
                }
                str+=jump[reg[0]]+'\n';
                binaryCode+=str;
                return true;
            }else{
                let bin = j.toString(2);
                if(bin.length>6){
                    console.log(`Label excide maximum bit`);
                    return false;
                }
                jump[reg[0]] = j;
                j++;
                let str='';
                let zeros = 6-bin.length;
                for(let i=0;i<zeros;i++){
                     str+='0';
                }
                str+=bin+'\n';
                binaryCode+=str;
                return true;
            }
            return false;

        case 'Inp':
        case 'Otp':
            binaryCode += instructions[command]+" ";
            binaryCode += '00 00 '+registers[reg[0]]+'\n';
            return true;

        case 'beq':
        case 'bne':
            // Not complete yet
            binaryCode += instructions[command]+' ';
            
            return true;
        case 'lw':
        case 'sw':

            /*
                lw $s2,2($s1)
                0101(op) 10($s1) 11($s2) 10(2)
            */


            let str = reg[1].slice(2,reg[1].length-1);
            if(registers[reg[0]] && registers[str] && instructions[command]){
                binaryCode += instructions[command]+' ';
                binaryCode += registers[str]+' ';
                binaryCode += registers[reg[0]]+' ';
                if(Number.parseInt(reg[1][0]) != NaN){
                    let bin = Number.parseInt(reg[1][0]).toString(2);
                    if(bin.length>2){
                        console.log(`number excide maximum bit`);
                        return false;
                    }
                    if(bin.length<2){
                        bin = '0'+bin;
                    }
                    binaryCode+=bin+'\n';
                }else{
                    return false;
                }
            }else{
                return false;
            }
            return true;
        default:
            return false;

    }
}

// Helper functions block end



arrayToObject(insArr,instructions);
arrayToObject(regArr,registers);

console.log("Assembling...");
for(let item of inputArr){
    comAndReg = item.split(' ')
    command = comAndReg[0].trim();
    reg = comAndReg[1].split(',').map(item=>item.trim()).filter(item=>item.length>0);
    if(machineCode(command,reg)){
        lineCount++;
    }else{
        assemError = true;
        console.log(`Error at line ${lineCount}`);
        break;
    }
    
}
if(!assemError){
    const write_bin = fs.writeFileSync('output_bin.txt',binaryCode,{encoding:'utf-8',flag:'w'});
    console.log("Complete");
} 

/*
console.log(instructions);
console.log(registers);
console.log(inputArr);
*/
console.log(binaryCode);



