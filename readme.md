# Replicant Registration API

RESTful API with Replicants and Blade Runners resource, as well as a Retirements resource. 
This API is designed for the LAPD to keep track of Replicants and tracking Blade Runner retirements. 

### Replicant Resource

When a new Replicant is discovered or found to be in violation, send a POST request to the /replicants resource with the following information: 
* Name (if known)
* Serial number
* Model
* Incept Date
* Manufacturer
* Purpose (if known)

Name and purpose fields are optional; all others are required.
This will create a new Replicant in the database with an assigned ID number. The replicant is assumed to not be retired, so retired: false and retiredBy: null default values are set. 

_Replicant Routes_
1. GET /replicants - returns a list of all replicants in the database
1. POST /replicants - add a new replicant to the database
1. GET /replicants/:id - returns an individual replicant, based on id (uuid v4)
1. PUT /replicants/:id - updates a replicant based on id - all fields are required
1. DELETE /replicants/:id - deletes a replicant based on id. 

_Replicant Schema:_
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

Blade Runners are tracked along with a list of their individual retirements. When a new Blade Runner is hired, 
send a POST request to the /bladerunners route with their name, species, and employer. This will return the newly created Blade Runner object with a UUID as well as an array of retired Replicants (which is empty).

_Blade Runner Routes_ 
1. GET /bladerunners - returns all known Blade Runners
1. POST /bladerunners - add a new Blade Runner
1. GET /bladerunners/:id - get an individual Blade Runner, based on id
1. PUT /bladerunners/:id - updates a Blade Runner based on id - all fields are required
1. DELETE /bladerunners/:id - deletes a Blade Runner based on id. 

_Blade Runner Schema:_
```
{
  id,
  name,
  species,
  employer,
  retired: [
    'id'
  ]
}
```

### Retirement

When a Blade Runner completes a mission, update the database by sending a POST request to:
/bladerunners/:id/retirements with the Replicant's ID number and the date of the retirement. 

1. POST /bladerunners/:id/retirements - adds a new Retirement resource to the given Blade Runner. 
  - Schema for request body: 
  ```
  {
    "id": Replicant ID 
    "retiredOn": date 
  }
  ```
  This creates a new retirement: 
 ```
  {
    retirementId
    replicantId
    replicantName
    retirementDate
  }
  ```
  This also updates the associated Replicant record with retiredOn date and retiredBy Blade Runner ID: 
  ```
  {
    retired: true,
    retiredBy: bladerunnerId
  }
  ```
  as well as adding the Replicant ID to the Blade Runner retired [] array.

  This POST request returns the new Retirement object: 
  ```
  {
    data: {
      retirement: {
        id,
        replicantId,
        bladeRunnerId,
        date
      }
    }
  }
  ```

_Other Retirements routes:_ 

1. GET /bladerunners/:id/retirements - retrieve a list of all replicants retired by a given Blade Runner
1. GET /bladerunners/:id/retirements/:retirementId - retrieve information for a particular retirement
1. PUT /bladerunners/:id/retirements/:retirementId - update information for given retirement; all fields are required
1. DELETE /bladerunners/:id/retirements/:retirementId - should not be used as a rule, but exists in case incorrect information is given