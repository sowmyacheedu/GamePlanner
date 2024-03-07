const geolib = require("geolib");
const Company = require("../models/Company");
const Franchise = require("../models/Franchise");
const User = require("../models/User");
const validation = require("./validation");

exports.franchisesByPrice = async (req, res) => {
  console.log("Sort by Price Hit");
  if(!req.body) return res.status(400).json({error: 'Missing Body'});
  if(!req.body.type) return res.status(400).json({error: 'Missing Type'});
  var asc = null;
  if(req.body.type === 'asc')  asc = true;
  if(req.body.type === 'des') asc = false;
  if(asc == null) return res.status(400).json({error: 'Invalid Sorting Type'});
  var franchises = null;
  if (req.body.company) {
    await Company.findById(req.body.company)
      .then((result) => {
        if (result == null)
          res.status(404).json({ error: "Company Not Found" });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
    await Franchise.find({ company: req.body.company })
      .then((result) => {
        franchises = result;
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } else {
    await Franchise.find({})
      .then((result) => {
        franchises = result;
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  }
  franchises.sort((a, b) => {
    var res = a.price - b.price;
    if(!asc)  res *= -1;
    return res;
  });
  return res.status(200).json({
    success: true,
    data: {
      franchises: franchiseJson(franchises)
    }});
};

exports.franchisesByDistance = async (req, res) => {
  console.log("Sort by Distance Hit");
  if(!req.body) return res.status(400).json({error: 'Missing Body'});
  if(!req.body.type) return res.status(400).json({error: 'Missing Type'});
  var asc = null;
  if(req.body.type === 'asc')  asc = true;
  if(req.body.type === 'des') asc = false;
  if(asc == null) return res.status(400).json({error: 'Invalid Sorting Type'});
  if (!req.body.location)
    return res.status(400).json({ error: "Missing Location" });
  if (!validation.location(req.body.location))
    return res.status(400).json({ error: "Invalid Location" });
  var franchises = null;
  if (req.body && req.body.company) {
    await Company.findById(req.body.company)
      .then((result) => {
        if (result == null)
          return res.status(404).json({ error: "Company Not Found" });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
    await Franchise.find({ company: req.body.company })
      .then((result) => {
        franchises = result;
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } else {
    await Franchise.find({})
      .then((result) => {
        franchises = result;
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  }
  var dists = new Map();
  for (var i = 0; i < franchises.length; i++) {
    dists.set(franchises[i]._id, geolib.getDistance(
      { latitude: req.body.location.lat, longitude: req.body.location.lng},
      {
        latitude: franchises[i].location.lat,
        longitude: franchises[i].location.lng,
      }
    ) * 0.000621371);
  }
  franchises.sort((a, b) => {
    var res = dists.get(a._id) - dists.get(b._id);
    if(!asc)  res *= -1;
    return res;
  });
  return res
    .status(200)
    .json({
      success: true,
      data: {
        franchises: franchiseJsonDist(franchises, dists)
    }});
};

exports.popularFranchises = async (req, res) => {
  console.log("Popular API hit");
  var franchises = null;
  if (req.body && req.body.company) {
    await Company.findById(req.body.company)
      .then((result) => {
        if (result == null)
          res.status(404).json({ error: "Company Not Found" });
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
    await Franchise.find({ company: req.body.company })
      .then((result) => {
        franchises = result;
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  } else {
    await Franchise.find({})
      .then((result) => {
        franchises = result;
      })
      .catch((err) => {
        return res.status(500).json({ error: err.message });
      });
  }
  var userCount = new Map();
  for (var i = 0; i < franchises.length; i++)
    userCount.set(
      franchises[i]._id,
      await User.count({ franchise: franchises[i], userType: 'Customer' })
    );
  franchises.sort((a, b) => {
    return userCount.get(b._id) - userCount.get(a._id);
  });
  const maxSize = 5; //maximum number of results (this can be modified)
  if (franchises.length > maxSize)
    franchises.splice(maxSize, franchises.length - maxSize);
  return res.status(200).json({
    success: true,
    data: {
      franchises: franchiseJson(franchises)
    }});
};

function franchiseJsonDist(franchises, distMap) {
  const res = [];
  for (var i = 0; i < franchises.length; i++) {
    res.push({
      _id: franchises[i]._id,
      name: franchises[i].name,
      address: franchises[i].address,
      price: franchises[i].price,
      distance: Math.round((distMap.get(franchises[i]._id) + Number.EPSILON) * 100) / 100,
    });
  }
  return res;
}

function franchiseJson(franchises) {
  const res = [];
  for (var i = 0; i < franchises.length; i++) {
    res.push({
      _id: franchises[i]._id,
      name: franchises[i].name,
      address: franchises[i].address,
      price: franchises[i].price,
    });
  }
  return res;
}
