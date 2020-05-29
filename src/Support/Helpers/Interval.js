module.exports = class Interval
{
  constructor()
  {
    this.intervals = {}
  }

  has(key)
  {
    return this.intervals[key] !== undefined
  }

  set(key, callback, ms)
  {
    this.intervals[key] = setInterval(callback, ms)
  }

  forget(key)
  {
    if (this.has(key)) {
      clearInterval(this.intervals[key])
    }

    delete this.intervals[key]
  }

  flush()
  {
    Object.keys(this.intervals).forEach(key => {
      this.forget(key)
    })
  }
}
