# Replicant Registration API

RESTful API with Replicants and Blade Runners resource, as well as a Retirements resource. 

### Replicant Resource
1. GET /replicants - returns a list of all replicants in the database
1. POST /replicants - add a new replicant to the database
1. GET /replicants/:id - returns an individual replicant, based on id (uuid v4)
1. PUT /replicants/:id - updates a replicant based on id - all fields are required
1. DELETE /replicants/:id - deletes a replicant based on id. 

- Replicant schema: 
```
{
  id,
  name,
  model,
  serial,
  manufacturer,
  inceptDate,
  retired = false
  retiredDate = null
}
```

### Blade Runners Resource
1. GET /bladerunners - returns all known Blade Runners
1. POST /bladerunners - add a new Blade Runner
1. GET /bladerunners/:id - get an individual Blade Runner, based on id
1. PUT /bladerunners/:id - updates a Blade Runner based on id - all fields are required
1. DELETE /bladerunners/:id - deletes a Blade Runner based on id. 

- Blade Runner schema: 
```
{
  id,
  name,
  species,
  employer,
  retired: [
    {
      id,
      retiredOn
    }
  ]
}
```

### Retirement
1. POST /bladerunners/:id/retirements - adds a new Retirement resource to the given Blade Runner. 
  - Schema for request body: {
    "id": Replicant ID 
    "retiredOn": date 
  }
  - Creates a new retirement: {
    retirementId
    replicantId
    replicantName
    retirementDate
  }
  - Also updates the associated Replicant record: {
    retired: true,
    retiredOn: date, 
    retiredBy: bladerunnerId
  }
  - as well as adding the Replicant ID to the Blade Runner retired [] array
  - Returns {
    data: {
      retirement: {
        id,
        replicantId,
        bladeRunnerId,
        date
      }
    }
  }
1. GET /bladerunners/:id/retirements - retrieve a list of all replicants retired by a given Blade Runner
1. GET /bladerunners/:id/retirements/:retirementId - retrieve information for a particular retirement
1. PUT /bladerunners/:id/retirements/:retirementId - update information for given retirement; all fields are required
1. DELETE /bladerunners/:id/retirements/:retirementId - should not be used, but exists in case incorrect information is given