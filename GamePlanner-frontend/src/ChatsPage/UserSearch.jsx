import { AutoComplete, Input } from "antd"
import { useState, useEffect, useRef } from "react"

import { Avatar } from "react-chat-engine-advanced"

import axios from "axios"

//import { privateKey, projectId } from "../functions/constants"

const UserSearch = props => {
  const didMountRef = useRef(false)

  const privateKey = "0dda074b-9fbc-4611-97e3-5c649ecdd5c3"
  const projectId = "79ca702a-5109-4cf9-8a33-8d576f5bd04f"

  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState("")
  const [users, setUsers] = useState([])
  const [options, setOptions] = useState([])
  const count = 0;

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      const headers = { "Private-Key": privateKey }
      console.log("calling inside user search")
      axios
        .get("https://api.chatengine.io/users/", { headers })
        .then(r => setUsers(r.data))
        .catch()
    }
  },[count])

  const searchResult = query => {
    const foundUsers = users.filter(
      user =>
        JSON.stringify(user)
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1 &&
        user.username !== props.username
    )

    return foundUsers.map(user => {
      return {
        value: user.username,
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <span>
              <Avatar avatarUrl={user.avatar} username={user.username} />
            </span>
            <span>
              <div>
                {user.first_name} {user.last_name}
              </div>
              <div>{user.username}</div>
            </span>
          </div>
        )
      }
    })
  }
  const handleSearch = query => {
    setOptions(query ? searchResult(query) : [])
  }

  const onSelect = async(value) => {
    setLoading(true)

    const headers = {
      "Project-ID": projectId,
      "User-Name": props.username,
      "User-Secret": props.secret
    }
    const data = {
      usernames: [props.username, value]
    }
    await axios
      .put("https://api.chatengine.io/chats/", data, { headers })
      .then(r => {
        props.onSelect(r.data.id)
        setLoading(false)
        setQuery("")
      })
      .catch(() => setLoading(false))
  }

  return (
    <div>
      <AutoComplete
        dropdownMatchSelectWidth={252}
        className="ce-chat-form-autocomplete"
        options={options}
        onSelect={onSelect}
        onSearch={handleSearch}
        value={query}
      >
        <Input.Search
          size="large"
          placeholder="Chats"
          enterButton
          loading={loading}
          onChange={e => setQuery(e.target.value)}
        />
      </AutoComplete>
    </div>
  )
}

export default UserSearch
