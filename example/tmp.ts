class Mediator{
    static list: {name: number, colleague: Colleague}[] = [];

    operation(fromWho: number, toWho: number, message: string){
        for (let c of Mediator.list){
            if (c.name === toWho){
                c.colleague.receiveMessage(fromWho, message);
            }
        }
    }

    register(colleague: Colleague){
        Mediator.list.push({
            name: colleague.name,
            colleague
        })
        colleague.mediator = this;
    }
}

class ConcreteMediator extends Mediator{

}

class Colleague{
    mediator: Mediator;
    name: number;
    constructor(name) {
        this.mediator = null;
        this.name = name;
    }

    setColleague(mediator){
        this.mediator = mediator;
    }

    sendMessage(toWho, message){
        console.log(`${this.name}发送消息给 ${toWho}: ${message}`)
        this.mediator.operation(this.name, toWho, message);
    }


    receiveMessage(fromWho, message){
        console.log(`${this.name}收到消息来自${fromWho}: ${message}`)
    }
}

class ConcreteColleagueA extends Colleague{
}

class ConcreteColleagueB extends Colleague{

}

function test(){
    return new Promise((_, reject) => {
        throw new Error('just a error');
        setTimeout(_ => {
            reject(new Error('just a error'));
        }, 1500)
    })
}

async function getProcessedData() {
    let v;
    try {
        return test().catch(_ => {
            console.log('++++')
            return _;
        }); // Note the `return await` vs. just `return`
    } catch (e) {
        console.log('*****')
        return null;
    }
}


// const a = new ConcreteColleagueA(1);
// const b = new ConcreteColleagueB(2);
// const mediator = new ConcreteMediator();
// mediator.register(a);
// mediator.register(b);
// a.sendMessage(2,'I am a');
// b.sendMessage(1,'I am b');

