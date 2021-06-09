const db = require('./database.js').rotinas;
db.loadDatabase();

// {
//     name:"Rotina 1",
//     hora:"06:00",
//     passos:[
//         ["Alterar Estado", "Quarto1", 1],
//         ["Delay", 1000],
//     ]
// }

exports.getRotinas = (req, res) => {
    db.find({}, (err, rotinasList) => {
        if (err) return res.sendStatus(500);
        return res.send(rotinasList);
    });
}

exports.getRotina = (req, res) => {
    db.find({_id:req.params.id}, (err, rotinasList) => {
        if (err) return res.sendStatus(500);
        return res.send(rotinasList);
    });
}

exports.getRotinaByTime = (date) => {
    return new Promise((resolve) => {
        minutos = (data.getMinutes() < 10) ? ('0'+ data.getMinutes()) : data.getMinutes();
        h = `${date.getHours()}:${minutos}`
        // console.log(h)
        db.find({hora: h}, async function (err, rotinasList) {
            if (err) return (null);
            // console.log(rotinasList)
            resolve(rotinasList);
        });
    });   
}

exports.addRotina = (req, res) => {
    db.insert(req.body, (err, newRotina) => {
        if (err) return res.status(500).send("Erro ao criar player!");
        // return res.status(200).json({id:newTeam["_id"]});
        res.send(newRotina);
    });
}

exports.delRotina = (req, res) => {
    let rotinaId = req.body._id;

    function removeTeam(err, rotinaList) {
        console.log(err)
       if(err) return res.sendStatus(500);
       if(!rotinaList[0]) return res.sendStatus(200);

       db.remove({_id:rotinaId}, {}, (err, numRemoved) => {
           if(err || numRemoved != 1) return res.sendStatus(500);
           return res.sendStatus(200);
       });
   }

   if (!rotinaId) {
       res.status(400).send("É necessário incluir o Id da Rotina");
   } else {
       db.find({_id:rotinaId}, removeTeam);
       console.log('Deleted');
   }
}

exports.patchRotina = (req,res) => {
    let rotina = req.body
	let rotinaId = req.body._id;

    db.update({_id:rotinaId}, {$set: rotina}, {}, (err, numReplaced) => {
        if(err) return res.sendStatus(500);
        console.log(numReplaced)
        return res.sendStatus(200);
        
    })
}