const SINGLE_ATTRIBUTE_STATES = [
    "suggested",
    "discussed",
    "approved",
    "declined",
    "replaced",
    "DELETED"
  ]
  
  const SINGLE_ATTRIBUTE_TRANSITIONS = {
    "suggest": {
      from: [],
      to: "suggested"
    },
    "discuss": {
      from: ["suggested"],
      to: "discussed"
    },
    "approve": {
      from: ["discussed", "declined", "replaced"],
      to: "approved"
    },
    "decline": {
      from: ["discussed", "approved"],
      to: "declined"
    },
    "delete": {
      from: SINGLE_ATTRIBUTE_STATES,
      to: "DELETED"
    }
  }
  
    
  const MULTIPLE_ATTRIBUTE_STATES = [
    "suggested",
    "discussed",
    "approved",
    "declined",
    "DELETED"
  ]
  
  const MULTIPLE_ATTRIBUTE_TRANSITIONS = {
    "suggest": {
      from: [],
      to: "suggested"
    },
    "discuss": {
      from: ["suggested"],
      to: "discussed"
    },
    "approve": {
      from: ["discussed", "declined"],
      to: "approved"
    },
    "decline": {
      from: ["discussed", "approved"],
      to: "declined"
    },
    "delete": {
      from: MULTIPLE_ATTRIBUTE_STATES,
      to: "DELETED"
    }
  }
  

  const MEMBER_STATES = [
    "suggested",
    "added",
    "invited",
    "discussed",
    "approved",
    "declined",
    "DELETED"
  ]
  
  const MEMBER_TRANSITIONS = {
    "add": {
      from: [],
      to: "approved"
    },
    "suggest": {
      from: [],
      to: "suggested"
    },
    "invite": {
      from: [],
      to: "invited"
    },
    "discuss": {
      from: ["suggested", "invited"],
      to: "discussed"
    },
    "approve": {
      from: ["discussed", "declined"],
      to: "approved"
    },
    "decline": {
      from: ["invited", "discussed", "approved"],
      to: "declined"
    },
    "delete": {
      from: MEMBER_STATES,
      to: "DELETED"
    }
  }
  


  exports.ENTITIES_METADATA = {
    //
    // purpose
    //
    purpose: {
      data_type: "string",
      max_cardinality: 1,
      states: SINGLE_ATTRIBUTE_STATES,
      transitions: SINGLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // name
    //
    name: {
      data_type: "short_string",
      max_cardinality: 1,
      states: SINGLE_ATTRIBUTE_STATES,
      transitions: SINGLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // description
    //
    description: {
      data_type: "string",
      max_cardinality: 1,
      states: SINGLE_ATTRIBUTE_STATES,
      transitions: SINGLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // logo
    //
    logo: {
      data_type: "image_url",
      max_cardinality: 1,
      states: SINGLE_ATTRIBUTE_STATES,
      transitions: SINGLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // intro
    //
    intro: {
      data_type: "video_url",
      max_cardinality: 1,
      states: SINGLE_ATTRIBUTE_STATES,
      transitions: SINGLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // tag
    //
    tag: {
      data_type: "short_string",
      states: MULTIPLE_ATTRIBUTE_STATES,
      transitions: MULTIPLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // tool
    //
    tool: {
      data_type: "tool",
      states: MULTIPLE_ATTRIBUTE_STATES,
      transitions: MULTIPLE_ATTRIBUTE_TRANSITIONS
    },
    //
    // member
    //
    member: {
      data_type: "person",
      states: MEMBER_STATES,
      transitions: MEMBER_TRANSITIONS
    }
  }
  