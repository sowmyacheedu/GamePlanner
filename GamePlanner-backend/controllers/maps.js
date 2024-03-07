const Company = require("../models/Company");
const Franchise = require("../models/Franchise");

exports.getMarkerInfo = async (req, res) => {
    console.log('get marker info hit');
    var list = [];
    const frans = await Franchise.find().catch((err) => {
        return res.status(500).json({error: 'Internal Error', msg: err.message});
    });
    for(let fran of frans) {
        const comp = await Company.findById(fran.company).catch((err) => {
            return res.status(500).json({error: 'Internal Error', msg: err.message});
        })
        list.push({
            company: comp.name,
            franchise: fran.name,
            address: fran.address,
            location: fran.location,
            dirlink: "https://maps.google.com/maps?daddr=" + fran.location.lat.toString() + ",+" + fran.location.lng.toString()
        })
    }
    return res.status(200).json({success: true, data: list});
}