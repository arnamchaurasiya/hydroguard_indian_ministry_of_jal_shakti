package database

import (
	"log"

	"github.com/bradfitz/gomemcache/memcache"
)

type Cache struct {
	Conn *memcache.Client
}

func InitCache(dsn string) (Cache, error) {
	c := Cache{memcache.New(dsn)}
	err := c.Conn.Ping()
	if err != nil {
		log.Printf("Memcached ping warning (%v) at %s. Continuing with memcache client.", err, dsn)
	}

	return c, nil
}

